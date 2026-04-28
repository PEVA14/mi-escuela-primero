export function getInvalidFieldNames(form) {
  return Array.from(form.elements)
    .filter((field) => (
      field instanceof HTMLElement &&
      typeof field.checkValidity === "function" &&
      (
        !field.checkValidity() ||
        (
          "required" in field &&
          field.required &&
          "value" in field &&
          typeof field.value === "string" &&
          field.type !== "checkbox" &&
          field.value.trim() === ""
        )
      )
    ))
    .map((field) => field.name)
    .filter(Boolean);
}

export function validateFormBeforeSubmit(event, setError, setInvalidFields) {
  const form = event.currentTarget;
  const invalidFields = getInvalidFieldNames(form);

  if (invalidFields.length > 0) {
    if (typeof setInvalidFields === "function") setInvalidFields(invalidFields);
    if (typeof setError === "function") setError(null);
    return false;
  }

  if (typeof setInvalidFields === "function") setInvalidFields([]);
  if (typeof setError === "function") setError(null);
  return true;
}
