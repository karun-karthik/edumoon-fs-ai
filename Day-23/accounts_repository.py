from db import database
from typing import Optional, List, Dict, Any
from bson import ObjectId


class AccountsRepository:
    """Repository for accounts collection operations"""
    
    COLLECTION_NAME = "accounts"
    
    @staticmethod
    def get_collection():
        """Get the accounts collection"""
        return database.get_collection(AccountsRepository.COLLECTION_NAME)
    
    @staticmethod
    def create_account(account_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new account in the database
        
        Args:
            account_data: Dictionary containing account information
                - name: str (required)
                - type: str (required)
                - balance: float (required)
                - userId: str (required)
            
        Returns:
            Created account with _id
        """
        collection = AccountsRepository.get_collection()
        result = collection.insert_one(account_data)
        account_data["_id"] = str(result.inserted_id)
        return account_data
    
    @staticmethod
    def get_account_by_id(account_id: str) -> Optional[Dict[str, Any]]:
        """
        Get an account by ID
        
        Args:
            account_id: Account ID (as string)
            
        Returns:
            Account document or None if not found
        """
        try:
            collection = AccountsRepository.get_collection()
            account = collection.find_one({"_id": ObjectId(account_id)})
            if account:
                account["_id"] = str(account["_id"])
            return account
        except Exception as e:
            print(f"Error getting account: {e}")
            return None
    
    @staticmethod
    def get_accounts_by_user_id(user_id: str) -> List[Dict[str, Any]]:
        """
        Get all accounts for a specific user
        
        Args:
            user_id: User ID (as string)
            
        Returns:
            List of account documents for the user
        """
        try:
            collection = AccountsRepository.get_collection()
            accounts = list(collection.find({"userId": user_id}))
            for account in accounts:
                account["_id"] = str(account["_id"])
            return accounts
        except Exception as e:
            print(f"Error getting accounts for user: {e}")
            return []
    
    @staticmethod
    def get_all_accounts() -> List[Dict[str, Any]]:
        """
        Get all accounts
        
        Returns:
            List of account documents
        """
        try:
            collection = AccountsRepository.get_collection()
            accounts = list(collection.find())
            for account in accounts:
                account["_id"] = str(account["_id"])
            return accounts
        except Exception as e:
            print(f"Error getting all accounts: {e}")
            return []
    
    @staticmethod
    def update_account(account_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Update an account by ID
        
        Args:
            account_id: Account ID (as string)
            update_data: Data to update
            
        Returns:
            Updated account document or None if not found
        """
        try:
            if update_data["_id"] is not None:
                del update_data["_id"]
            collection = AccountsRepository.get_collection()
            result = collection.find_one_and_update(
                {"_id": ObjectId(account_id)},
                {"$set": update_data},
                return_document=True
            )
            if result:
                result["_id"] = str(result["_id"])
            return result
        except Exception as e:
            print(f"Error updating account: {e}")
            return None
    
    @staticmethod
    def delete_account(account_id: str) -> bool:
        """
        Delete an account by ID
        
        Args:
            account_id: Account ID (as string)
            
        Returns:
            True if deleted, False otherwise
        """
        try:
            collection = AccountsRepository.get_collection()
            result = collection.delete_one({"_id": ObjectId(account_id)})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting account: {e}")
            return False
    
    @staticmethod
    def account_exists(account_id: str) -> bool:
        """
        Check if an account exists by ID
        
        Args:
            account_id: Account ID (as string)
            
        Returns:
            True if account exists, False otherwise
        """
        try:
            collection = AccountsRepository.get_collection()
            return collection.find_one({"_id": ObjectId(account_id)}) is not None
        except Exception as e:
            print(f"Error checking account existence: {e}")
            return False
    
    @staticmethod
    def get_user_account_count(user_id: str) -> int:
        """
        Get the count of accounts for a user
        
        Args:
            user_id: User ID (as string)
            
        Returns:
            Count of accounts
        """
        try:
            collection = AccountsRepository.get_collection()
            return collection.count_documents({"userId": user_id})
        except Exception as e:
            print(f"Error counting user accounts: {e}")
            return 0
