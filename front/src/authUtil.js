export const validationSchema = (validation) => {
    if (!validation.success) {
        const errorMessages = {};

        validation.error.errors.forEach((err) => {
            const path = err.path[0];
            if (!errorMessages[path]) {
                errorMessages[path] = [];
            }
            errorMessages[path].push(err.message);
        });

        return errorMessages;
    }
}