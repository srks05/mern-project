const withoutParameter=(req,res,next)=>{
    console.info("withoutParameter")
   
    next();
}
const withParameter=(obj)=>{
    return (req,res,next)=>{
        console.info("withParameter "+obj)
       
        next();
    }
}
// 
// const verifyToken = (req, res, next) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
//     if (!token) return res.status(403).json({ message: 'No token, authorization denied' });
  
//     jwt.verify(token, secretKey, (err, decoded) => {
//       if (err) return res.status(401).json({ message: 'Invalid token' });
//       req.user = decoded; // Attach user data to request object
//       next();
//     });
//   };
  
//   
//   const authorizeRole = (role) => {
//     return (req, res, next) => {
//       if (req.user.role !== role) {
//         return res.status(403).json({ message: 'Access denied' });
//       }
//       next();
//     };
//   };
module.exports={withParameter,withoutParameter};