import React from "react";
import UpgradeCard from "~/components/upgrade/UpgradeCard";

const Business = () => {
  return (
    <div className="flex h-full min-h-[100vh] w-full flex-col items-center space-y-2 py-2">
      <UpgradeCard
        cost={150}
        discount={15}
        description="Unlock the potential for business growth and community engagement with our 'Founder' tier. Build with us and get a lifetime of savings, expand your reach, and elevate your business to new heights within our vibrant community."
        upgrade="Founder"
        price_id="founder"
      />

      {/* <UpgradeCard
        cost={99}
        description="Unlock the potential for business growth and community engagement with our 'Business Builder' tier. When you choose this tier, you gain access to a wealth of resources, expert guidance, and a thriving network of local businesses. We're here to help you lay a solid foundation, expand your reach, and elevate your business to new heights within our vibrant community."
        upgrade="Business Builder"
      />
      <UpgradeCard
        cost={150}
        description=" Elevate your business to 'Community Connoisseur' status and showcase your commitment to making a difference locally. Our platform recognizes and promotes businesses like yours, known for their exceptional products or services and active involvement in community initiatives. By joining this tier, you amplify your impact, connect with a passionate audience, and strengthen your brand within our tightly-knit community."
        upgrade="Community Connoisseur"
      />
      <UpgradeCard
        cost={250}
        description="Join the ranks of our most distinguished businesses as a 'Local Legend.' Your brand has become synonymous with excellence and has left an enduring legacy in our community. By choosing this tier, you solidify your place as a revered and iconic establishment. Enjoy exclusive benefits, amplify your influence, and continue inspiring others with your remarkable journey. Your legendary status is a testament to your enduring success in our community."
        upgrade="Local Legend"
      /> */}
    </div>
  );
};

export default Business;
