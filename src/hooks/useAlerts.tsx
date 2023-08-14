import React, { useState } from "react";

function useAlerts() {
  const [visible, setVisible] = useState(false);

  const [error, setError] = useState(false);

  const onDismiss = () => setVisible(false);
  return {
    onDismiss,
    visible,
    setVisible,
    error,
  };
}

export default useAlerts;
