import jwt,{ JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (payload: JwtPayload, secret: string, expiresIn: SignOptions) => {
      console.log("expiresIn:", expiresIn);
  console.log("typeof expiresIn:", typeof expiresIn);
    const Token = jwt.sign(payload, secret, expiresIn);
    return Token;
}

const verifyToken = (token: string, secret: string) => {
    try {
        const verifiedToken = jwt.verify(token, secret);
        return {
            success: true,
            data: verifiedToken
        }
    } catch (error: any) {
        console.log("verified token error:", error);
        return {
            success: false,
            error: error.message
        }
    }
}

export const jwtUtils = {
    createToken, verifyToken
}

// import jwt, { JwtPayload } from "jsonwebtoken";

// const createToken = (
//   payload: JwtPayload,
//   secret: string,
//   expiresIn: string
// ) => {
//   return jwt.sign(payload, secret, {
//     expiresIn,
//   });
// };

// const verifyToken = (token: string, secret: string) => {
//   try {
//     const verifiedToken = jwt.verify(token, secret);
//     return {
//       success: true,
//       data: verifiedToken,
//     };
//   } catch (error: any) {
//     console.log("verified token error:", error);
//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

// export const jwtUtils = {
//   createToken,
//   verifyToken,
// };