import React, { useState } from "react";

const plans = [
  { id: "basic", name: "Basic", price: "₹0/mo", features: ["5 Time Image Generation", "5 Time Videos Generation", "8 Time Posting"] },
  { id: "premium", name: "Premium", price: "₹999/mo", features: ["Unlimited Images Generation", "Unlimited Videos Generation", "Scheduling Post", "Unlimited Posting"] },
];

const Plan = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  const handleConfirm = () => {
    if (!selectedPlan) return;

    if (selectedPlan.id === "premium") {
      // upgrade
      setIsPremium(true);
    } else {
      // downgrade to basic
      setIsPremium(false);
    }
    setSelectedPlan(null);
  };

  return (
    <section id="pricing" className="relative z-10 mx-auto my-24 max-w-6xl px-6">
      {/* header */}
      <div className="text-center">
        <h2 className="text-white text-4xl md:text-5xl font-bold">
          Choose Your <span className="text-yellow-400">Plan</span>
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto mt-3">
          Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
        </p>
      </div>

      {/* plan cards - centered & aligned */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 w-fit mx-auto">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlan(plan)}
            className="group relative rounded-2xl bg-gray-900 p-6 shadow-lg border border-gray-700 w-80 flex flex-col transition-all duration-500 ease-in-out hover:shadow-2xl hover:shadow-yellow-400/10 hover:border-yellow-400/30 hover:bg-gradient-to-br hover:from-gray-900 hover:to-gray-800 hover:scale-[1.02] cursor-pointer text-left"
          >
            {/* Subtle golden border glow on hover */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-none">
              <div className="absolute inset-0 rounded-2xl border border-yellow-400/20 animate-pulse"></div>
              <div className="absolute inset-[-1px] rounded-2xl bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent blur-[1px]"></div>
            </div>
            
            {/* Very subtle inner glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/0 to-yellow-400/0 group-hover:from-yellow-400/3 group-hover:to-yellow-400/5 transition-all duration-500 pointer-events-none"></div>
            
            {/* Card content with relative positioning */}
            <div className="relative z-10 h-full flex flex-col">
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="text-yellow-400 text-2xl mt-2">{plan.price}</p>
              <ul className="mt-4 text-gray-400 space-y-2 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-yellow-400 mr-2">✔</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              
              {/* Subscribe button inside card */}
              <div className="mt-6 w-full rounded-xl bg-yellow-400 text-black font-semibold px-4 py-2 hover:bg-yellow-300 transition-colors duration-200 text-center">
                Subscribe
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* themed premium badge (shows only when premium) */}
      {isPremium && (
        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 px-6 py-3 rounded-full font-semibold shadow-md animate-pulse">
            ⭐ You are now a Premium Member! ⭐
          </div>
        </div>
      )}

      {/* modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-700 relative overflow-hidden">
            {/* Golden accent border */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 rounded-2xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <h3 className="text-white text-2xl font-bold">Checkout</h3>
              <p className="text-gray-400 mt-2">
                You are choosing{" "}
                <span className="text-yellow-400 font-semibold">{selectedPlan.name}</span> ({selectedPlan.price})
              </p>

              {/* Show payment fields ONLY for Premium */}
              {selectedPlan.id === "premium" ? (
                <div className="mt-4 space-y-3">
                  <input className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200" placeholder="Card Number" />
                  <div className="flex gap-2">
                    <input className="w-1/2 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200" placeholder="MM/YY" />
                    <input className="w-1/2 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200" placeholder="CVC" />
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-sm text-gray-300 bg-gray-800/60 border border-gray-700 rounded-lg p-3">
                  No payment required for Basic. Click <span className="text-yellow-400 font-medium">Confirm</span> to switch.
                </div>
              )}

              {/* actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="flex-1 rounded-xl border border-gray-600 text-gray-300 px-4 py-2 hover:bg-gray-800 hover:border-gray-500 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 rounded-xl bg-yellow-400 text-black font-semibold px-4 py-2 hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/30 transition-all duration-200"
                >
                  {selectedPlan.id === "premium" ? "Confirm Payment" : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Plan;