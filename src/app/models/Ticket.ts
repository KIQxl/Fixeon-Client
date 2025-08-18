export interface Ticket{
    id: string;
    protocol: string;
    title: string;
    description: string;
    createdAt: Date;
    modifiedAt: Date | null;
    resolvedAt: Date | null;
    createdBy: string;
    assignedTo: string | null;
    category: string;
    priority: string;
    status: string;
    interactions: Interaction[] | null;
    durationFormat: string;
    duration: string | null;
    attachments: string[];
    organizationName: string
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

export interface InteractionUser{
    userId: string;
    userName: string;
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



export function traduzirPrioridade(priority: string | undefined): string{
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

  export function traduzirStatus(priority: string | undefined): string{
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