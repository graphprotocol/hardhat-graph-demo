//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DemoNFT is ERC721, Ownable {
    address private authorizedAuction;

    modifier onlyAuction() {
        require (_msgSender() == authorizedAuction, "Only authorized auctions can mint");
        _;
    }

    constructor() ERC721("DemoNFT", "DNFT") {}

    function authorizeAuction(address _auction) onlyOwner() public {
        authorizedAuction = _auction;
    }

    function mintDemo(uint256 _tokenId) onlyAuction() public {
        // require(_msgSender() == authorizedAuction, "Only authorized address can mint!");

        _safeMint(_msgSender(), _tokenId);
    }
}
