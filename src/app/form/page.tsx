"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectForm } from "@/components/Base/SelectForm";

const FormPage: React.FC = () => {

    return (
        <div className="sm:p-10 bg-slate-400 w-[100vw] h-screen">
            <Tabs defaultValue="3rd Semester" className="w-[100%] bg-slate-300 p-4 rounded-lg">
                
                <TabsList className="w-[100%]">
                    <TabsTrigger value="3rd Semester" className="w-1/3">3rd Semester</TabsTrigger>
                    <TabsTrigger value="5th Semester" className="w-1/3">5th Semester</TabsTrigger>
                    <TabsTrigger value="7th Semester" className="w-1/3">7th Semester</TabsTrigger>
                </TabsList>
                <TabsContent value="3rd Semester"><SelectForm semester={3}/></TabsContent>
                <TabsContent value="5th Semester"><SelectForm semester={5}/></TabsContent>
                <TabsContent value="7th Semester"><SelectForm semester={7}/></TabsContent>
            </Tabs>
        </div>

    );
};

export default FormPage;

