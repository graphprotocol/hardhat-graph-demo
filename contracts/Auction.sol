//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

interface IDemoNFT {
    function mintDemo(uint _tokenId) external;

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;
}

contract NFTAuction is Ownable, IERC721Receiver {
    using SafeMath for uint256;

    event AuctionStarted(uint256 id, address creator, uint256 tokenId, uint256 startDate, uint256 startPrice);
    event AuctionEnded(uint256 id, uint256 tokenId, address winner, uint256 endPrice);
    event Bid(uint256 auctionId, uint256 tokenId, address bidder, uint256 amount);
    event Withdraw(uint256 tokenId, address to , uint256 amount, bool success);

    address private tokenContractAddress;
    uint256 private auctionId = 1;
    uint256 public duration = 5 days;
    uint256 public bidIncrement = 0.01 ether;

    modifier tokenContractSet() {
        require(tokenContractAddress != address(0), "Token contract address can't be zero address");
        _;
    }

    struct Auction {
        uint256 id;
        address creator;
        uint256 startDate;
        uint256 endDate;
        uint256 startPrice;
    }

    mapping(uint256 => bool) tokenIsAuctioned; // Used to check if token is currently auctioned
    mapping(uint256 => Auction) tokenToAuction; // Maps token to current Auction, if any
    mapping(uint256 => uint256) tokenHighestBid; // Holds the highest bid for that token
    mapping(uint256 => address) tokenHighestBidder; // Holds the highest bidder for that token
    mapping(address => mapping(uint256 => uint256) ) addressAmountPerToken; // Holds the amount of tokens bid by each bidder for each token

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) public override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function setTokenAddress(address _tokenContractAddress) onlyOwner() public {
        tokenContractAddress = _tokenContractAddress;
    }

    function startAuction(uint256 _tokenId) tokenContractSet() external payable {
        require(msg.value >= bidIncrement, "Not enough ether to start the auction");
        require(tokenIsAuctioned[_tokenId] == false, "Token already auctioned");
        require(tokenContractAddress != address(0), "Token address can't be zero address");

        IDemoNFT DemoNFT = IDemoNFT(tokenContractAddress);
        DemoNFT.mintDemo(_tokenId);

        uint256 startDate = block.timestamp;

        Auction memory auction = Auction(auctionId, address(this), startDate, startDate + duration, 0);
        tokenToAuction[_tokenId] = auction;
        tokenIsAuctioned[_tokenId] = true;

        emit AuctionStarted(auctionId, auction.creator, _tokenId, auction.startDate, auction.startPrice);

        auctionId = auctionId + 1;

        _bid(_tokenId);
    }

    function startAuction(uint256 _tokenId, uint256 _startPrice) tokenContractSet() external {
        require(tokenIsAuctioned[_tokenId] == false, "Token already auctioned");

        IDemoNFT DemoNFT = IDemoNFT(tokenContractAddress);
        DemoNFT.safeTransferFrom(_msgSender(), address(this), _tokenId);

        uint256 startDate = block.timestamp;
        Auction memory auction = Auction(auctionId, _msgSender(), startDate, startDate + duration, _startPrice);
        tokenToAuction[_tokenId] = auction;
        tokenIsAuctioned[_tokenId] = true;
        tokenHighestBid[_tokenId] = _startPrice;

        emit AuctionStarted(auctionId, auction.creator, _tokenId, auction.startDate, auction.startPrice);

        auctionId = auctionId + 1;
    }

    function bid(uint256 _tokenId) tokenContractSet() external payable {
        require(tokenIsAuctioned[_tokenId] == true, "Token not auctioned");
        require(block.timestamp < tokenToAuction[_tokenId].endDate, "Auction has already ended");

       _bid(_tokenId);
    }

    function _bid(uint256 _tokenId) internal {
         // Seller can't bid on his own token
        require(_msgSender() != tokenToAuction[_tokenId].creator, "You can't bid on your own token");

        uint256 bidderTokenTotal = addressAmountPerToken[_msgSender()][_tokenId] + msg.value;
        uint256 minBid = tokenHighestBid[_tokenId] + bidIncrement;
        require(bidderTokenTotal >= minBid, "Not enough ether to bid");

        addressAmountPerToken[_msgSender()][_tokenId] = bidderTokenTotal;
        tokenHighestBid[_tokenId] = bidderTokenTotal;
        tokenHighestBidder[_tokenId] = _msgSender();
        Auction memory auction = tokenToAuction[_tokenId];

        emit Bid(auction.id, _tokenId, _msgSender(), msg.value);
    }

    function endAuction(uint256 _tokenId) tokenContractSet() external {
        require(tokenIsAuctioned[_tokenId] == true, "Token not auctioned");
        require(block.timestamp >= tokenToAuction[_tokenId].endDate, "Auction duration is not over");
        require(_msgSender() == tokenToAuction[_tokenId].creator || _msgSender() == owner(), "Only creator or owner can end the auction");

        address winner = tokenHighestBidder[_tokenId];
        delete tokenHighestBidder[_tokenId];
        uint256 price = tokenHighestBid[_tokenId];
        delete tokenHighestBid[_tokenId];

        // Deduct final price from winner balance
        addressAmountPerToken[winner][_tokenId] = addressAmountPerToken[winner][_tokenId] - price;
        // Set auction to ended
        delete tokenIsAuctioned[_tokenId];
         // Emit AuctionEnded
        emit AuctionEnded(tokenToAuction[_tokenId].id, _tokenId, winner, price);
        // Transfer token to winner
        IDemoNFT DemoNFT = IDemoNFT(tokenContractAddress);
        DemoNFT.safeTransferFrom(address(this), winner, _tokenId);
        // Transfer money to seller
        address seller = tokenToAuction[_tokenId].creator;

        if (seller != address(this)) {
             (bool success, ) = payable(seller).call{value: price}("");

            if (!success) {
                addressAmountPerToken[seller][_tokenId] =
                    addressAmountPerToken[seller][_tokenId] +
                    price;
            }

            emit Withdraw(_tokenId, seller, price, success);
        }
    }

    function withdraw(uint256 _tokenId) public {
        // msg.sender is not highest bidder
        require(tokenHighestBidder[_tokenId] != _msgSender(), "Highest bidder can't withdraw");
        // msg.sender has funds to wihtdraw
        require(addressAmountPerToken[_msgSender()][_tokenId] > 0, "No funds to withdraw");

        uint256 amount = addressAmountPerToken[_msgSender()][_tokenId];

        (bool success, ) = payable(_msgSender()).call{value: amount}("");

         if (success) {
           delete addressAmountPerToken[_msgSender()][_tokenId];
        }

        emit Withdraw(_tokenId, _msgSender(), amount, success);
    }
}
