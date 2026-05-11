import { useEffect } from "react";
import { supabase } from "../../../../supabase/supabase";
import { PluggyConnect as PluggyConnectSDK } from "pluggy-connect-sdk";

interface PluggyConnectProps {
  onSuccess: (accountId: string) => void;
  onError: (errorMessage: string) => void;
  onClose: () => void;
}

const PluggyConnect: React.FC<PluggyConnectProps> = ({
  onSuccess,
  onError,
  onClose,
}) => {
  useEffect(() => {
    const PluggyConnectWidget = async () => {
      const { data, error } = await supabase.functions.invoke("pluggy-auth");
      if (error || !data.connectToken) {
        onError("Erro ao obter connectToken!");
        return;
      }
      const widget = new PluggyConnectSDK({
        connectToken: data.connectToken,
        onSuccess: async (itemData: { item: { id: string } }) => {
          const itemId = itemData.item.id;

          const response = await fetch(
            `https://api.pluggy.ai/accounts?itemId=${itemId}`,
            { headers: { "X-API-KEY": data.apiKey } },
          );
          const accountsData = await response.json();

          const accounts = accountsData.results;

          const checking = accounts.find(
            (account: { subtype: string }) =>
              account.subtype === "CHECKING_ACCOUNT",
          );
          const accountId = checking ? checking.id : accounts[0].id;
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from("users")
              .update({ pluggy_account_id: accountId })
              .eq("user_id", user.id);
          }
          onSuccess(accountId);
        },
        onError: (error: { message: string }) => {
          onError(error.message);
        },
        onClose: () => {
          onClose();
        },
      });
      widget.init();
    };
    PluggyConnectWidget();
  }, []);
};
export { PluggyConnect };
