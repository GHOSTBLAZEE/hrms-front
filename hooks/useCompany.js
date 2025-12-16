import {useQuery,useMutation,useQueryClient} from "@tanstack/react-query";
import * as api from "@/lib/companyApi";
import {toast} from "sonner";

export function useCompanies(){
  const qc=useQueryClient();

  const q=useQuery({queryKey:["companies"],queryFn:api.getCompaniesApi});

  const create=useMutation({
    mutationFn:api.createCompanyApi,
    onSuccess:()=>{toast.success("Company created");qc.invalidateQueries(["companies"]);}
  });

  const update=useMutation({
    mutationFn:({id,data})=>api.updateCompanyApi(id,data),
    onSuccess:()=>{toast.success("Company updated");qc.invalidateQueries(["companies"]);}
  });

  const remove=useMutation({
    mutationFn:api.deleteCompanyApi,
    onSuccess:()=>{toast.success("Company deleted");qc.invalidateQueries(["companies"]);}
  });

  return {...q,create,update,remove};
}
