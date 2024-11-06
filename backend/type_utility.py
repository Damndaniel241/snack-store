from sqlalchemy.types import TypeDecorator, CHAR
import uuid

class GUID(TypeDecorator):
    """Platform-independent GUID type.

    Uses CHAR(36) to store UUIDs as strings.
    """
    
    impl = CHAR(36)
    
    def process_bind_param(self,value,dialect):
        if value is None:
            return value
        if isinstance(value, uuid.UUID):
            return str(value)
        
        raise ValueError("value %s is not a valid uuid.UUID" % value)
    
    def process_result_value(self, value, dialect):
        if value is None:
            return value
        return uuid.UUID(value)
        