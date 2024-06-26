import { Request, Response } from "express";
import { CustomError, LoginUserDTO, RegisterUserDTO } from "../../domain";
import { AuthService } from "../services/auth.service";
import { error } from "console";

export class AuthController{
    constructor(public readonly authServices: AuthService) {}

    private handleError = (error: any,res:Response)=>{
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({error:error.message})
        }
        console.log(`${error}`)
        return res.status(500).json({error: 'Internal server error'})
    }

    registerUser = (req: Request, res:Response) =>{
        const [error,registerDTO] = RegisterUserDTO.create(req.body)
        if(error) return res.status(400).json({error})
        this.authServices.registerUser(registerDTO!).then(
            (user)=> res.json(user)).catch(
                error=> this.handleError(error,res)
            )

    }
    loginUser =(req: Request, res:Response) =>{
        const [error,loginUserDTO] = LoginUserDTO.create(req.body)
        if(error) return res.status(400).json({error})
        this.authServices.loginUser(loginUserDTO!).then(
            (user)=> res.json(user)).catch(
                error=> this.handleError(error,res)
            )
    }

    validateEmail =(req: Request, res:Response) =>{
        const {token} = req.params
        this.authServices.validateEmail(token).then(()=>res.json('Email was validated properly'))
        .catch( error => this.handleError(error,res))

    }

}