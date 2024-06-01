import jwt from 'jsonwebtoken'

const auth = (req, res, next) =>{ //next is used to allow every controllers to be executed
    try {
        const token = req.headers.authorization.split(' ')[1]

        let decodeData = jwt.verify(token, process.env.JWT_SECRET )
        req.userId = decodeData?.id //?. is select optionally
        next() //helps to ask the next function in routes questions
    } catch (error) {
        console.log(error)
    }
}

export default auth