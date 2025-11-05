export interface Ticket{
  id: string;
  protocol: string;
  title: string;
  description: string;
  createdAt: Date;
  modifiedAt: Date | null;
  resolvedAt: Date | null;
  customer: Customer;
  analyst: Analyst;
  category: string;
  priority: string;
  status: string;
  departament: string;
  interactions: Interaction[] | null;
  durationFormat: string;
  duration: string | null;
  attachments: string[];
  closedBy: Analyst
  slaInfo: SLAInfo;
  }

export interface Customer{
  userId: string;
  userEmail: string;
  organizationName: string | null;
  organizationId: string | null;
}

export interface Analyst{
  analystId: string;
  analystEmail: string;
}

export interface Interaction{
  ticketId: string;
  message: string;
  attachmentsUrls: string[];
  createdAt: Date;
  createdByUserName: string;
  createdByUserId: string;
}

export interface Attachment{
  name: string;
  extension: string;
  uploadedAt: Date;
  senderId: string;
  ticketId: string | null;
  interactionId: string | null;
}

export interface CreateTicketDto{
  title: string;
  description: string;
  category: string;
  CreateByUserId: string;
  CreateByUsername: string;
  priority: number;
  files: File[];
}

export interface CreateTicketInteractionDto{
  TicketId: string;
  CreateByUserId: string;
  CreateByUsername: string;
  Message: string;
  files: File[];
}

export interface CreateAssignTicketRequest{
  TicketId: string;
  AnalystId: string;
  AnalystEmail: string;
}

export interface ChangeTicketStatusRequest{
  TicketId: string;
  Status: number;
}

export interface Category{
  id: string;
  name: string;
}

export interface Departament{
  id: string;
  name: string;
}

export interface SLAInfo{
  firstInteraction: SLA;
  resolution: SLA;
}

export interface SLA{
  deadline: Date | null;
  accomplished: Date | null;
}

export interface ChangeTicketCategoryAndDepartament{
  Id: string;
  OrganizationId: string;
  CategoryId: string;
  DepartamentId: string;
}

export interface Tag{
  id: string;
  name: string;
}

export function TranslatePriority(priority: string | undefined): string{
    switch(priority){
      case "Low":
        return "Baixa";

        case "Medium":
        return "Média";

        case "High":
        return "Alta";

        default:
          return "-";
    }
  }

  export interface TicketAnalysisResponse{
    pending: number;
    inProgress: number;
    resolved: number;
    canceled: number;
    reOpened: number;
    total: number;
    averageResolutionTimeInHours: string;
  }

  export interface AnalystTicketsAnalysis{
    analystName: string;
    analystId: string;
    pendingTickets: number;
    resolvedTickets: number;
    ticketsTotal: number;
    averageResolutionTimeInHours: string;
  }

  export interface TopAnalystResponse{
    analystName: string;
    ticketsLast30Days: number;
    averageTime: string;
  }

  export interface TicketsByDayResponse{
    date: Date;
    created: number;
    resolved: number;
  }

  export interface TicketsByHourResponse{
    hour: number;
    ticketsCreated: number;
  }

  export interface TicketDashboardResponse{
    ticketAnalysisResponse: TicketAnalysisResponse;
    analystTicketsAnalyses: AnalystTicketsAnalysis [];
    topAnalystResponse: TopAnalystResponse [];
    ticketsByDay: TicketsByDayResponse [];
    ticketsByHour: TicketsByHourResponse [];
    ticketSLAAnalysisResponse: TicketSLAAnalysisResponse[];
  }

  export interface TicketSLAAnalysisResponse{
    organizationId: string;
    organizationName: string;
    totalTickets: number;
    resolutionTicketsWithSLA: number;
    resolutionWithinSLA: number;
    resolutionWithinSLAPercentage: number;
    firstInteractionTicketsWithSLA: number;
    firstInteractionWithinSLA: number;
    firstInteractionWithinSLAPercentage: number;
  }

  export function TranslateStatus(priority: string | undefined): string{
    switch(priority){
      case "InProgress":
        return "Em progresso";

        case "Pending":
        return "Pendente";

        case "Resolved":
        return "Resolvido";

        case "Canceled":
        return "Cancelado";

        case "Reopened":
        return "Reaberto";

        default:
          return "-";
    }
  }