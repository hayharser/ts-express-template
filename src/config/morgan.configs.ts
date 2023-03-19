const { NODE_ENV } = process.env;
let morganFormat = ':method :url :status :response-time ms - :res[content-length] \n :body';
if (NODE_ENV === 'production') {
    morganFormat = 'tiny';
}

export { morganFormat };
