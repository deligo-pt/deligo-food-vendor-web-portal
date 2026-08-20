export const ORDER_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  PREPARING: "PREPARING",
  READY_FOR_PICKUP: "READY_FOR_PICKUP",
  AWAITING_PARTNER: "AWAITING_PARTNER",
  DISPATCHING: "DISPATCHING",
  ASSIGNED: "ASSIGNED",
  REASSIGNMENT_NEEDED: "REASSIGNMENT_NEEDED",
  PICKED_UP: "PICKED_UP",
  PICKED_UP_BY_CUSTOMER: "PICKED_UP_BY_CUSTOMER",
  NO_SHOW: "NO_SHOW",
  ON_THE_WAY: "ON_THE_WAY",
  DELIVERED: "DELIVERED",
  CANCELED: "CANCELED",
};

export const FULFILLMENT_TYPE = {
  DELIVERY: 'DELIVERY',
  PICKUP: 'PICKUP',
};

export const getOrderStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    [ORDER_STATUS.PENDING]: "Pending",
    [ORDER_STATUS.ACCEPTED]: "Accepted",
    [ORDER_STATUS.REJECTED]: "Rejected",
    [ORDER_STATUS.PREPARING]: "Preparing",
    [ORDER_STATUS.READY_FOR_PICKUP]: "Ready for Pickup",
    [ORDER_STATUS.AWAITING_PARTNER]: "Waiting for Partner",
    [ORDER_STATUS.DISPATCHING]: "Dispatching",
    [ORDER_STATUS.ASSIGNED]: "Assigned",
    [ORDER_STATUS.REASSIGNMENT_NEEDED]: "Reassignment Needed",
    [ORDER_STATUS.PICKED_UP]: "Picked Up",
    [ORDER_STATUS.PICKED_UP_BY_CUSTOMER]: "Picked up by customer",
    [ORDER_STATUS.NO_SHOW]: "Not picked up",
    [ORDER_STATUS.ON_THE_WAY]: "On the Way",
    [ORDER_STATUS.DELIVERED]: "Delivered",
    [ORDER_STATUS.CANCELED]: "Canceled",
  };

  return statusMap[status] || status;
};