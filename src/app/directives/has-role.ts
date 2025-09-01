import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Auth_Services } from '../services/auth-services';

export type PolicyName = 'MasterAdminPolicy' | 'AdminPolicy' | 'AnalistaPolicy' | 'UsuarioPolicy';

export const Policies: Record<PolicyName, string[]> = {
  MasterAdminPolicy: ['MasterAdmin'],
  AdminPolicy: ['Admin', 'MasterAdmin'],
  AnalistaPolicy: ['Analista', 'Admin', 'MasterAdmin'],
  UsuarioPolicy: ['Usuario', 'Analista', 'Admin', 'MasterAdmin']
};

@Directive({
  selector: '[appHasRole]'
})
export class HasRole {
  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private authService: Auth_Services) { }

  @Input() set appHasRole(policy: PolicyName){

    let roles: string[] = Policies[policy] || [policy];

    if(this.authService.IsAuthorize(roles)){
      this.viewContainer.createEmbeddedView(this.templateRef)
    }
    else
    {
      this.viewContainer.clear()
    }
  }
}
