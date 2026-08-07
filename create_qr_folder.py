# Python script to generate initial QR placeholder images for Adv. Shruti Kirty & Adv. Prince Kumar
import os
from PIL import Image, ImageDraw

QR_DIR = "d:/Nyaysetu/frontend/public/img/qrcodes"
os.makedirs(QR_DIR, exist_ok=True)

def create_qr_image(path, name, upi_id):
    img = Image.new('RGB', (400, 400), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # Outer border
    draw.rectangle([10, 10, 390, 390], outline=(200, 155, 82), width=6)
    
    # Title
    draw.text((20, 20), f"PAY ₹500 TO {name.upper()}", fill=(18, 26, 43))
    
    # Inner QR pattern box
    draw.rectangle([50, 60, 350, 320], fill=(18, 26, 43), outline=(200, 155, 82), width=3)
    
    # QR corner blocks
    draw.rectangle([70, 80, 130, 140], fill=(200, 155, 82))
    draw.rectangle([270, 80, 330, 140], fill=(200, 155, 82))
    draw.rectangle([70, 240, 130, 300], fill=(200, 155, 82))
    
    # UPI ID Text
    draw.text((30, 345), f"UPI ID: {upi_id}", fill=(18, 26, 43))
    
    img.save(path)
    print(f"Created QR image: {path}")

create_qr_image(os.path.join(QR_DIR, "shruti_kirty_qr.png"), "Adv. Shruti Kirty", "shrutikirty@upi")
create_qr_image(os.path.join(QR_DIR, "prince_kumar_qr.png"), "Adv. Prince Kumar", "princekumar@upi")

print("QR images for Adv. Shruti Kirty and Adv. Prince Kumar created successfully!")
