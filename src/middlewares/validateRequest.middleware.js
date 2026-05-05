const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.flatten();

      return res.status(400).json({
        message: "Validation failed",
        errors: errors.fieldErrors,
        // formErrors: errors.formErrors,
      });
    }

    req.body = result.data;

    next();
  };
};

export { validateRequest };
