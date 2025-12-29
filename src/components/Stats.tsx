import { ShieldCheck, Users, Wallet, Network } from "lucide-react";

const Stats = () => {
  return (
    <div className="mt-4 w-full flex justify-center">
      <div className="grid grid-cols-4 mx-4 p-2 border md:border-2 border-cyan-500 md:p-4 rounded-4xl md:grid-cols-4 gap-10 md:gap-20 text-center">

        {/* ITEM 1 */}
        <div className="flex flex-col items-center">
          <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
          <p className="text-[10px] md:text-sm text-gray-600 dark:text-gray-300">
            Trusted Since
          </p>
          <p className="text-md font-bold text-gray-900 dark:text-white">
            1994
          </p>
        </div>

        {/* ITEM 2 */}
        <div className="flex flex-col items-center">
          <Users className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
          <p className="text-[10px] md:text-sm text-gray-600 dark:text-gray-300">
            Happy
          </p>
          <p className="text-md font-bold text-gray-900 dark:text-white">
            42,71,690
          </p>
        </div>

        {/* ITEM 3 */}
        <div className="flex flex-col items-center">
          <Wallet className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
          <p className="text-[10px] md:text-sm text-gray-600 dark:text-gray-300">
            Assets
          </p>
          <p className="text-md font-bold text-gray-900 dark:text-white">
            2,86,147Cr.
          </p>
        </div>

        {/* ITEM 4 */}
        <div className="flex flex-col items-center">
          <Network className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" />
          <p className="text-[10px] md:text-sm text-gray-600 dark:text-gray-300">
            Distributors
          </p>
          
          <p className="text-md font-bold text-gray-900 dark:text-white">
            50,932
          </p>
        </div>

      </div>
    </div>
  );
};

export default Stats;
