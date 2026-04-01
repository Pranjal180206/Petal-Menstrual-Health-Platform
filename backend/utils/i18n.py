SUPPORTED_LANGUAGES = {"en", "hi", "mr"}
DEFAULT_LANGUAGE = "en"


def resolve_lang(lang: str) -> str:
    if lang and lang.lower() in SUPPORTED_LANGUAGES:
        return lang.lower()
    return DEFAULT_LANGUAGE


def translate_field(field, lang: str):
    if field is None:
        return None
    if isinstance(field, dict):
        return field.get(lang) or field.get(DEFAULT_LANGUAGE) or None
    return field


def translate_document(doc: dict, lang: str, fields: list) -> dict:
    for field in fields:
        if field in doc:
            doc[field] = translate_field(doc[field], lang)
    return doc
