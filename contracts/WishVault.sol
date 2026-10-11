// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title WishVault
 * @notice A secure, decentralized on-chain vault for dreams, wishes, and goals.
 */
contract WishVault {
    // Custom Errors
    error EmptyTitle();
    error TitleTooLong();
    error DescriptionTooLong();
    error WishNotFound();
    error NotWishOwner();
    error WishAlreadyCompleted();
    error InvalidWishIndex();

    // Struct definition
    struct Wish {
        uint256 id;
        address owner;
        string title;
        string description;
        uint256 createdAt;
        bool completed;
    }

    // Helper struct for quick wish lookup
    struct WishLocation {
        address owner;
        uint256 index;
        bool exists;
    }

    // Maximum limits
    uint256 public constant MAX_TITLE_LENGTH = 80;
    uint256 public constant MAX_DESCRIPTION_LENGTH = 280;

    // State variables
    uint256 private _nextWishId = 1;
    mapping(address => Wish[]) private _userWishes;
    mapping(uint256 => WishLocation) private _wishLocations;

    // Events
    event WishAdded(
        uint256 indexed id,
        address indexed owner,
        string title,
        string description,
        uint256 createdAt
    );

    event WishCompleted(
        uint256 indexed id,
        address indexed owner,
        uint256 completedAt
    );

    /**
     * @notice Adds a new wish to the caller's wishlist.
     * @param title Wish title (1 to 80 characters).
     * @param description Optional wish description (0 to 280 characters).
     */
    function addWish(string calldata title, string calldata description) external returns (uint256) {
        uint256 titleLen = _utf8Length(title);
        if (titleLen == 0) {
            revert EmptyTitle();
        }
        if (titleLen > MAX_TITLE_LENGTH) {
            revert TitleTooLong();
        }

        uint256 descLen = _utf8Length(description);
        if (descLen > MAX_DESCRIPTION_LENGTH) {
            revert DescriptionTooLong();
        }

        uint256 wishId = _nextWishId++;
        uint256 index = _userWishes[msg.sender].length;
        uint256 timestamp = block.timestamp;

        Wish memory newWish = Wish({
            id: wishId,
            owner: msg.sender,
            title: title,
            description: description,
            createdAt: timestamp,
            completed: false
        });

        _userWishes[msg.sender].push(newWish);
        _wishLocations[wishId] = WishLocation({
            owner: msg.sender,
            index: index,
            exists: true
        });

        emit WishAdded(wishId, msg.sender, title, description, timestamp);

        return wishId;
    }

    /**
     * @notice Marks an existing wish as completed.
     * @param wishId Unique ID of the wish.
     */
    function completeWish(uint256 wishId) external {
        WishLocation memory location = _wishLocations[wishId];
        if (!location.exists) {
            revert WishNotFound();
        }
        if (location.owner != msg.sender) {
            revert NotWishOwner();
        }

        Wish storage wish = _userWishes[msg.sender][location.index];
        if (wish.completed) {
            revert WishAlreadyCompleted();
        }

        wish.completed = true;

        emit WishCompleted(wishId, msg.sender, block.timestamp);
    }

    /**
     * @notice Returns all wishes belonging to the caller.
     */
    function getMyWishes() external view returns (Wish[] memory) {
        return _userWishes[msg.sender];
    }

    /**
     * @notice Returns total number of wishes for a given wallet address.
     * @param user The wallet address to query.
     */
    function getWishCount(address user) external view returns (uint256) {
        return _userWishes[user].length;
    }

    /**
     * @notice Returns a single wish by index for a given wallet address.
     * @param user The wallet address to query.
     * @param index Zero-based index in the user's wishlist array.
     */
    function getWish(address user, uint256 index) external view returns (Wish memory) {
        if (index >= _userWishes[user].length) {
            revert InvalidWishIndex();
        }
        return _userWishes[user][index];
    }

    /**
     * @dev Calculates string character length by decoding UTF-8 code points.
     */
    function _utf8Length(string memory str) internal pure returns (uint256 length) {
        bytes memory stringBytes = bytes(str);
        uint256 i = 0;
        while (i < stringBytes.length) {
            uint8 b = uint8(stringBytes[i]);
            if (b < 0x80) {
                i += 1;
            } else if ((b & 0xE0) == 0xC0) {
                i += 2;
            } else if ((b & 0xF0) == 0xE0) {
                i += 3;
            } else if ((b & 0xF8) == 0xF0) {
                i += 4;
            } else {
                i += 1; // Fallback for invalid sequence
            }
            length++;
        }
        return length;
    }
}
