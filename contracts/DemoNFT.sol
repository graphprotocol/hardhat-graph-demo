//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DemoNFT is ERC721URIStorage, Ownable {

    constructor() ERC721("DemoNFT", "DNFT") {}

    function mintDemo(address _to, uint256 _tokenId, string memory _tokenURI) onlyOwner public {
        require(owner() != _to, "Recipient cannot be the owner of the contract");

        _safeMint(_to, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
    }
}
