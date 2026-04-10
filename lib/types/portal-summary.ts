  
export type PortalSummary = {
  notifications: {
    unread_count: number;
  };
  quotes: {
    total: number;
    open: number;
  };
  proposals: {
    total: number;
    awaiting_response: number;
  };
  estimates: {
    total: number;
    awaiting_response: number;
  };
  projects: {
    total: number;
    active: number;
  };
  invoices: {
    total: number;
    unpaid: number;
    overdue: number;
  };
  documents: {
    pending_review: number;
    rejected: number;
  };
};
