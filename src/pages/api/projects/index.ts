import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

export interface Project {
    nome:string,
    patrocinador:string,
    curso:string,
    numDInicio:number,
    numDFinal:number,
    autor:string,
}


export default async function handler(req: NextApiRequest, res: NextApiResponse<Project[]>) {
    if (req.method === 'POST') {
        const { nome,patrocinador,curso,numDInicio,numDFinal,autor } = req.body

        try {
            const arq = fs.readFileSync(process.cwd() + "/projects.json", "utf-8")   
            const t= 'teste'         
            const filteredProjects = JSON.parse(arq).filter((p) => {return(
                (parseInt(p.createdAt)=== numDInicio || numDInicio===null) &&
                (parseInt(p.endDate) === numDFinal || numDFinal===null) &&
                (p.title.toLowerCase().includes(nome.toLowerCase()) || nome==='') &&
                (p.typeOfFinancing !==null ? p.typeOfFinancing.toLowerCase().includes(patrocinador.toLowerCase()) : patrocinador==='') &&
                (p.contributors.some(contributor=>contributor.name.toLowerCase().includes(autor.toLowerCase())) || autor==='') &&
                (curso==='')
            )});
            return res
                .status(201) //Created
                .json(filteredProjects)
        } catch (error) {  
            console.log(error)
            alert("Ocorreu um erro ao enviar solicitação")
            return res
                .status(400) //Bad Request
                .json([])
        }
    } else {
        return res.status(405) //Method not allowed
    }
}