module nft_marketplace_address::nft {
    use std::signer;
    use std::vector;
    use std::string::String;

    struct State has store, key {
        nfts: vector<NFT>,
        count: u64,
    }

    struct NFT has copy, store {
        id: u64,
        owner: address,
        ipfs_hash: String,
        price: u64,
    }

    public fun init(creator: &signer) {
        if (!exists<State>(signer::address_of(creator))) {
            move_to(creator, State {
                nfts: vector::empty<NFT>(),
                count: 0,
            });
        }
    }

    // Mint a new NFT
    public entry fun mint_nft(user: &signer, ipfs_hash: String, price: u64) acquires State {
        let user_addr = signer::address_of(user);
        let state = borrow_global_mut<State>(user_addr);

        let new_nft = NFT {
            id: state.count,
            owner: user_addr,
            ipfs_hash,
            price,
        };

        vector::push_back(&mut state.nfts, new_nft);
        state.count = state.count + 1;
    }

    #[view]
    public fun view_count(): u64 acquires State {
        let state = borrow_global<State>(@nft_marketplace_address);
        state.count
    }

    #[view]
    public fun view_nfts(): vector<NFT> acquires State {
        let state = borrow_global<State>(@nft_marketplace_address);
        state.nfts
    }

}

{
  "Result": {
    "transaction_hash": "0x1ec3c858de61539aca0d015c0fff6e1c90e6949fbb8eb553cafd4b9e0c6bc72c",
    "gas_used": 1540,
    "gas_unit_price": 100,
    "sender": "a817c48739252236274629df8fff952b3d3be385862263b26eeaa9477d3b5d6b",
    "sequence_number": 0,
    "success": true,
    "timestamp_us": 1733835110528284,
    "version": 56543873,
    "vm_status": "Executed successfully"
  }
}
