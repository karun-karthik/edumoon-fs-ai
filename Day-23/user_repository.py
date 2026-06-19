from db import database
from typing import Optional, List, Dict, Any
from bson import ObjectId


class UserRepository:
    """Repository for user collection operations"""
    
    COLLECTION_NAME = "users"
    
    @staticmethod
    def get_collection():
        """Get the users collection"""
        return database.get_collection(UserRepository.COLLECTION_NAME)
    
    @staticmethod
    def create_user(user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new user in the database
        
        Args:
            user_data: Dictionary containing user information
            
        Returns:
            Created user with _id
        """
        collection = UserRepository.get_collection()
        result = collection.insert_one(user_data)
        user_data["_id"] = str(result.inserted_id)
        return user_data
    
    @staticmethod
    def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a user by ID
        
        Args:
            user_id: User ID (as string)
            
        Returns:
            User document or None if not found
        """
        try:
            collection = UserRepository.get_collection()
            user = collection.find_one({"_id": ObjectId(user_id)})
            if user:
                user["_id"] = str(user["_id"])
            return user
        except Exception as e:
            print(f"Error getting user: {e}")
            return None
    
    @staticmethod
    def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
        """
        Get a user by email
        
        Args:
            email: User email
            
        Returns:
            User document or None if not found
        """
        collection = UserRepository.get_collection()
        user = collection.find_one({"email": email})
        if user:
            user["_id"] = str(user["_id"])
        return user
    
    @staticmethod
    def get_all_users() -> List[Dict[str, Any]]:
        """
        Get all users
        
        Returns:
            List of user documents
        """
        collection = UserRepository.get_collection()
        users = list(collection.find())
        for user in users:
            user["_id"] = str(user["_id"])
        return users
    
    @staticmethod
    def update_user(user_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Update a user by ID
        
        Args:
            user_id: User ID (as string)
            update_data: Data to update
            
        Returns:
            Updated user document or None if not found
        """
        try:
            collection = UserRepository.get_collection()
            result = collection.find_one_and_update(
                {"_id": ObjectId(user_id)},
                {"$set": update_data},
                return_document=True
            )
            if result:
                result["_id"] = str(result["_id"])
            return result
        except Exception as e:
            print(f"Error updating user: {e}")
            return None
    
    @staticmethod
    def delete_user(user_id: str) -> bool:
        """
        Delete a user by ID
        
        Args:
            user_id: User ID (as string)
            
        Returns:
            True if deleted, False otherwise
        """
        try:
            collection = UserRepository.get_collection()
            result = collection.delete_one({"_id": ObjectId(user_id)})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting user: {e}")
            return False
    
    @staticmethod
    def user_exists(email: str) -> bool:
        """
        Check if a user exists by email
        
        Args:
            email: User email
            
        Returns:
            True if user exists, False otherwise
        """
        collection = UserRepository.get_collection()
        return collection.find_one({"email": email}) is not None
