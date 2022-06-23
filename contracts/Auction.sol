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

    event AuctionStarted(address seller, uint256 tokenId, uint256 startDate, uint256 startPrice);
    event AuctionEnded(uint256 tokenId, address seller, uint256 endPrice);
    event Bid(uint256 tokenId, address bidder, uint256 amount);

    address private tokenContractAddress;
    uint256 public duration = 5 days;
    uint256 public bidStep = 0.01 ether;

    modifier tokenContractSet() {
        require(tokenContractAddress != address(0), "Token contract address can't be zero address");
        _;
    }

    struct Auction {
        address payable creator;
        uint256 startDate;
        uint256 endDate;
        uint256 startPrice;
    }

    mapping(uint256 => bool) tokenIsAuctioned; // Used to check if token is currently auctioned
    mapping(uint256 => Auction) tokenToAuction;
    mapping(uint256 => uint256) highestBid;

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) public override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function setTokenAddress(address _tokenContractAddress) onlyOwner() public {
        tokenContractAddress = _tokenContractAddress;
    }

    function startAuction(uint256 _tokenId) tokenContractSet() external payable {
        require(msg.value >= bidStep, "Not enough ether to start the auction");
        require(tokenIsAuctioned[_tokenId] == false, "Token already auctioned");
        require(tokenContractAddress != address(0), "Token address can't be zero address");

        IDemoNFT DemoNFT = IDemoNFT(tokenContractAddress);
        DemoNFT.mintDemo(_tokenId);

        uint256 startDate = block.timestamp;
        Auction memory auction = Auction(payable(_msgSender()), startDate, startDate + duration, 0);
        tokenToAuction[_tokenId] = auction;
        tokenIsAuctioned[_tokenId] = true;

        emit AuctionStarted(auction.creator, _tokenId, auction.startDate, auction.startPrice);
    }

    function startAuction(uint256 _tokenId, uint256 _startPrice) tokenContractSet() external {
        require(tokenIsAuctioned[_tokenId] == false, "Token already auctioned");

        IDemoNFT DemoNFT = IDemoNFT(tokenContractAddress);
        DemoNFT.safeTransferFrom(_msgSender(), address(this), _tokenId);

        uint256 startDate = block.timestamp;
        Auction memory auction = Auction(payable(_msgSender()), startDate, startDate + duration, _startPrice);
        tokenToAuction[_tokenId] = auction;
        tokenIsAuctioned[_tokenId] = true;

        emit AuctionStarted(auction.creator, _tokenId, auction.startDate, auction.startPrice);
    }

    // function bid(uint256 _amount, uint256 tokenId) tokenContractSet() public {
    //     // check if token is auctioned adn auction is active
    //     // check if bid step is greater than current bid/price
    // }

    // function endAuction(uint256 tokenId) tokenContractSet() public {
    //     require(tokenIsAuctioned[_tokenId] == true, "Token not auctioned");


    //     require(block.timestamp > )
    //     // check auction end time has passed
    //     // end auction
    //     // transfer token to winner
    // }

    // function withdraw(uint256 tokenID) public {
    //     // check token was auctioned
    //     // check if auction is ended
    //     // check msg.sender is not the winner
    //     // check msg.sender has made a bid
    //     // return ammount to msg.sender
    // }
}
