'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {SelectForm} from "@/components/Base/SelectForm";

const FormPage: React.FC = () => {

    return (
        <div className="p-10 bg-slate-400 w-[100vw] h-screen">
            <Tabs defaultValue="Third Year" className="w-[100%] bg-slate-300 p-4 rounded-lg">
                <TabsList className="w-[100%]">
                    <TabsTrigger value="Third Year" className="w-1/3">Third Year</TabsTrigger>
                    <TabsTrigger value="Fifth Year" className="w-1/3">Fifth Year</TabsTrigger>
                    <TabsTrigger value="Seventh Year" className="w-1/3">Seventh Year</TabsTrigger>
                </TabsList>
                <TabsContent value="Third Year"><SelectForm/></TabsContent>
                <TabsContent value="Fifth Year">This is a Fifth Year Form</TabsContent>
                <TabsContent value="Seventh Year">This is a Seventh Year Form</TabsContent>
            </Tabs>
        </div>

    );
};

export default FormPage;
// const FormPage = () => {
//     return(
//         <div>
//             This is form page
//         </div>
//     );
// }
// export default FormPage;