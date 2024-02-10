from Crypto.Cipher import ChaCha20

# open the suspicious text file and read in its contents
with open("SuspiciousFile.txt.Encrypted", "rb") as thing:
    material = bytearray(thing.read())

# define helper function that splits the indexable object `it` at index `idx`
split = lambda it, idx : (it[:idx], it[idx:])

# parse the data from the back to front 

# find the encrypted key that was used for the ChaCha20 encryption
assert material.pop() == 0xa, "Invalid seperator, must be 0xa"
material, encrypted_key = split(material, -256)

assert material.pop() == 0xa, "Invalid seperator, must be 0xa"
material, _ = split(material, -256)

# find the rsa-parameter n
assert material.pop() == 0xa, "Invalid seperator, must be 0xa"
material, n = split(material, -256)

assert material.pop() == 0xa, "Invalid seperator, must be 0xa"
encrypted_data, _ = split(material, -256)

# rsa-decrypt the key, nonce and counter to-be-used for the ChaCha20 computations 
n = int(n.decode("utf-8"), 16)
encrypted_key = int(encrypted_key.decode("utf-8"), 16)
decrypted_key = pow(encrypted_key, 0x10001, mod=n)
decrypted_key_bytes = decrypted_key.to_bytes(0x30, "little")

# extract the key and the nonce from (key | counter | nonce)
# counter is hardcoded to zero in flareon.exe, so it is not extracted
key = decrypted_key_bytes[:0x20]
nonce = decrypted_key_bytes[0x24:]

# decrypt the file content and output it to stdout
output = bytes()
cipher = ChaCha20.new(key=key, nonce=nonce)
for i in range(0, len(encrypted_data), 0x40):
    chunk = encrypted_data[i:i + 0x40]
    output += cipher.decrypt(chunk)

print(output.decode("utf-8"))