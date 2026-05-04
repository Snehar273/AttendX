import qrcode
import base64
import secrets
import io
from datetime import datetime, timedelta


def generate_qr_token():
    """Generate a secure random token for QR code."""
    return secrets.token_urlsafe(32)


def generate_qr_image(data: str) -> str:
    """
    Generate QR code image from data string.
    Returns base64 encoded PNG string.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)

    img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    return img_base64


def get_qr_expiry(seconds=15):
    """Returns expiry datetime for QR token."""
    return datetime.utcnow() + timedelta(seconds=seconds)