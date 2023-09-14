import { formatPhoneNumber } from "~/forms/BusinessSetupForm";
import { api } from "~/utils/api";

const BusinessDetail = ({ business_id }: { business_id: string }) => {
  const { data: businessInfo } = api.user.getBusiness.useQuery({ business_id });

  return (
    businessInfo && (
      <div className="flex w-full flex-col gap-1 rounded-b-md bg-accent p-2 text-zinc-100 ">
        <div className="flex items-center justify-between lg:px-2">
          <p className="text-left text-lg font-bold">
            {businessInfo?.business_name}
          </p>
          <p className=" text-center text-xs">{businessInfo?.zip_code}</p>
          <p className="text-center">
            {formatPhoneNumber(businessInfo?.phone_number.slice(2))}
          </p>
        </div>
        {businessInfo.website && <p className="p-2">{businessInfo?.website}</p>}
      </div>
    )
  );
};

export default BusinessDetail;
