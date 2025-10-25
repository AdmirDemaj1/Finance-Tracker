import {
  useState,
  useCallback,
  FormEvent,
  ChangeEvent,
  FocusEvent,
} from "react";
import {
  UseFormReturn,
  ValidationRules,
  FormErrors,
  TouchFields,
} from "../types";



export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules,
  onSubmit: (values: T) => Promise<void> | void
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [touched, setTouched] = useState<TouchFields>({});

  const handleChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ): void => {
      const { name, value, type } = e.target;

    
      const inputValue =
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

      setValues((prev) => ({
        ...prev,
        [name]: inputValue,
      }));

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors]
  );

  const handleBlur = useCallback(
    (
      e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ): void => {
      const { name } = e.target;

      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      if (validationRules[name]) {
        const error = validationRules[name](values[name as keyof T], values);

        if (error) {
          setErrors((prev) => ({
            ...prev,
            [name]: error,
          }));
        }
      }
    },
    [values, validationRules]
  );

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validationRules[fieldName](
        values[fieldName as keyof T],
        values
      );
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);

    const allTouched = Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as TouchFields);
    setTouched(allTouched);

    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();

      const isValid = validate();

      if (!isValid) {
        return;
      }

      setIsSubmitting(true);

      try {
        await onSubmit(values);

        setValues(initialValues);
        setErrors({});
        setTouched({});
      } catch (error) {
        console.error("Form submission error:", error);

        setErrors((prev) => ({
          ...prev,
          submit: error instanceof Error ? error.message : "Submission failed",
        }));
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit, initialValues]
  );

  const reset = useCallback((): void => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldValue = useCallback((fieldName: string, value: any): void => {
    setValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }, []);

  const shouldShowError = useCallback(
    (fieldName: string): boolean => {
      return Boolean(touched[fieldName] && errors[fieldName]);
    },
    [touched, errors]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    shouldShowError,
  };
};
