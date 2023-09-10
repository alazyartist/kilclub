import { formatPhoneNumber } from "~/forms/BusinessSetupForm";
import { api } from "~/utils/api";

const BusinessDetail = ({ business_id }: { business_id: string }) => {
  const { data: businessInfo } = api.user.getBusiness.useQuery({ business_id });

  return (
    businessInfo && (
      <div className="flex flex-col gap-1 rounded-md bg-accent p-2 text-zinc-100 ">
        <p className="p-2 text-center text-lg font-bold">
          {businessInfo?.business_name}
        </p>
        <p className="text-center">
          {formatPhoneNumber(businessInfo?.phone_number.slice(2))}
        </p>
        {businessInfo.website && <p className="p-2">{businessInfo?.website}</p>}
        <p className=" text-center text-xs">{businessInfo?.zip_code}</p>
      </div>
    )
  );
};

export default BusinessDetail;
