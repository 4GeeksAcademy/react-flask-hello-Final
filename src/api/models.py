from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Integer, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    level: Mapped[int] = mapped_column(Integer, default=1)
    avatar_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
    
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "level": self.level,
            "avatar_url": self.avatar_url,
            "created_at": self.created_at.isoformat(),
            
        }
class Event(db.Model):
    __tablename__ = "events"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False) 
    sport: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)  
    datetime: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    address: Mapped[str] = mapped_column(String(200), nullable=True)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    price: Mapped[int] = mapped_column(Integer, default=0)
    is_free: Mapped[bool] = mapped_column(Boolean, default=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    
    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,  # Incluir en serialización
            "sport": self.sport,
            "description": self.description,  # Incluir en serialización
            "datetime": self.datetime.isoformat(),
            "address": self.address, 
            "capacity": self.capacity,
            "price": self.price,
            "is_free": self.is_free,
            "user_id": self.user_id,
        }
"""
class EventPlayer(db.Model):
    __tablename__= "event_players"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] =mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    event_id: Mapped[int] =mapped_column(Integer, ForeignKey("events.id"), nullable=False)
    paid: Mapped[bool] =mapped_column(Boolean, default=False)
    material: Mapped[str | None] = mapped_column(String(200), nullable=True)
    created_at: Mapped[datetime] =mapped_column(DateTime, default=datetime.utcnow)
    user: Mapped["User"] = relationship("User", back_populates="registrations")
    event: Mapped["Event"] = relationship("Event", back_populates="players")
    def serialize(self):
        return {
            "id":self.id,
            "user_id":self.user_id,
            "event_id":self.event_id,
            "paid":self.paid,
            "material":self.material,
            "created_at": self.created_at.isoformat(),
        }
        """