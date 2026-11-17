"""
File Parser Module for Resume Ingestion.
Extracts clean plain text from PDF, DOCX, and TXT files.
Integrated from SkillBridge / Analyzer into CodeDNA.
"""
import io
import os
from typing import Union


MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


def extract_text_from_bytes(file_bytes: bytes, filename: str) -> str:
    """Extracts plain text from file bytes (PDF, DOCX, TXT) with content & magic-byte validation."""
    if not file_bytes or len(file_bytes.strip()) == 0:
        raise ValueError("Uploaded file is empty (0 bytes).")

    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise ValueError("File exceeds maximum allowed size (10 MB).")

    ext = os.path.splitext(filename)[1].lower()

    if ext == ".pdf":
        # Magic bytes check: PDF must begin with %PDF
        if not file_bytes.startswith(b"%PDF"):
            raise ValueError("File content does not match expected PDF document format (invalid header).")
        return _extract_from_pdf_stream(io.BytesIO(file_bytes))
    elif ext == ".docx":
        # Magic bytes check: DOCX (OOXML) is a PKZip archive beginning with PK\x03\x04
        if not file_bytes.startswith(b"PK\x03\x04"):
            raise ValueError("File content does not match expected DOCX document format (invalid archive header).")
        return _extract_from_docx_stream(io.BytesIO(file_bytes))
    elif ext in (".txt", ".md", ".text"):
        decoded = file_bytes.decode("utf-8", errors="ignore").strip()
        if not decoded:
            raise ValueError("Uploaded text document contains no readable text.")
        return decoded
    else:
        raise ValueError(f"Unsupported document format '{ext}'. Please upload a PDF, DOCX, or TXT file.")


def extract_text_from_path(file_path: str) -> str:
    """Extracts plain text from a local file path."""
    with open(file_path, "rb") as f:
        data = f.read()
    return extract_text_from_bytes(data, os.path.basename(file_path))


def _extract_from_pdf_stream(stream: io.BytesIO) -> str:
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(stream)
        if len(reader.pages) > 50:
            raise ValueError("Document exceeds maximum page limit (50 pages).")
        text_parts = []
        for idx, page in enumerate(reader.pages):
            page_text = page.extract_text()
            if page_text and page_text.strip():
                text_parts.append(page_text.strip())
        
        extracted = "\n\n".join(text_parts).strip()
        if not extracted:
            raise ValueError("Could not extract readable text from PDF. The document may be scanned or empty.")
        return extracted
    except ValueError:
        raise
    except Exception as e:
        raise ValueError(f"Failed to parse PDF document: malformed or corrupted file ({str(e)[:100]}).")


def _extract_from_docx_stream(stream: io.BytesIO) -> str:
    try:
        import docx
        doc = docx.Document(stream)
        parts = []
        for para in doc.paragraphs:
            if para.text and para.text.strip():
                parts.append(para.text.strip())
        for table in doc.tables:
            for row in table.rows:
                row_cells = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                if row_cells:
                    parts.append(" | ".join(row_cells))
        
        extracted = "\n".join(parts).strip()
        if not extracted:
            raise ValueError("Could not extract readable text from DOCX document.")
        return extracted
    except ValueError:
        raise
    except Exception as e:
        raise ValueError(f"Failed to parse DOCX document: malformed or corrupted archive ({str(e)[:100]}).")
