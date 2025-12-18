export const badRequest = (body) => ({
    statusCode: 400,
    body,
})

export const created = (body) => ({
    statusCode: 201,
    body,
})

export const serverError = (body) => ({
    statusCode: 500,
    body,
})

export const ok = (body) => ({
    statusCode: 200,
    body,
})
