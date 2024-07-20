import { titleFonts } from "@/config/fonts";


interface Props {
    title: string;
    subTitle?: string;
    clssName?: string;
}


export const Title = ({ title, subTitle, clssName }: Props) => {
    return (
        <div className={`mt-3 ${clssName}`}>
            <h1
                className={`${titleFonts.className} antialiased text-4xl font-semibold my-10`}>
                {title}
            </h1>

            {
                subTitle && (
                    <h3 className="text-xl mb-5">{subTitle}</h3>
                )
            }
        </div>
    );
};