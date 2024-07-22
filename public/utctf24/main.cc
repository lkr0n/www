#include <stdio.h>

#include <vector>
#include <span>
#include <array>
#include <regex>
#include <string>

#include <bls12-381/bls12-381.hpp>


int main(int argc, char * argv[]) {

    if (argc != 2) {
        fprintf(stderr, "Usage: ./forgerySolve <bob's pk>\n");
        return -1;
    }

    // Validate bob's public key. The expected format is a string of 192 hex digits,
    // characters all lowercase, no trailing whitespace and no leading 0x prefix.
    std::regex pkRegex("^[a-z0-9]{192}$", std::regex_constants::ECMAScript); 
    std::string hexBobPk = argv[1];
    bool validPk = std::regex_match(hexBobPk, pkRegex);
    if (!validPk) {
        fprintf(stderr, "Invalid bob pk hex: %s\n", hexBobPk.c_str());
        return -2;
    }

    // Parse bob's public key into its elliptic curve point representation
    auto bytesBobPk = bls12_381::hexToBytes<96>(hexBobPk);
    std::optional<bls12_381::g1> bobPk = bls12_381::g1::fromAffineBytesLE(bytesBobPk);
    if(!bobPk) {
        fprintf(stderr, "Invalid bob pk: %s\n", hexBobPk.c_str());
        return -3;
    }

    // Generate our private and public key pairs from a randomly chosen seed.
    std::vector<uint8_t> seed(32, 0x42);
    std::array<uint64_t, 4> sk = bls12_381::secret_key(seed);
    bls12_381::g1 pk = bls12_381::public_key(sk);

    // Sign the message with our secret key.
    // This will be the signature that the server will accept.
    std::string message = "Bob and I signed the deal.";
    std::vector<uint8_t>  raw_message(message.begin(), message.end());
    bls12_381::g2 sig = bls12_381::sign(sk, raw_message);

    // Compute the rogue public key to submit to the server.
    // The server will compute the aggregate signature of 'Bob and I signed the deal.' .
    // In doing so it will add the public key we submit 
    // to the public key of bob. We submit pk - bobPk, therefore bobPk
    // will cancel out when the signature is computed.
    bls12_381::g1 roguePk = pk.subtract(*bobPk);
    
    // Print the information to be pasted into the challenge server 
    printf("rogue pk: ");
    auto pkBytes = roguePk.toAffineBytesLE();
    for (uint8_t byte : pkBytes) {
        printf("%02x", byte);
    }
    printf("\n");

    printf("sig: ");
    auto sigBytes = sig.toAffineBytesLE();
    for (uint8_t byte : sigBytes) {
        printf("%02x", byte);
    }
    printf("\n");

    return 0;
}
