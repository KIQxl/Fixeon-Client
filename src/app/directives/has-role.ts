import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Auth_Services } from '../services/auth-services';

@Directive({
  selector: '[appHasRole]'
})
export class HasRole {
  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private authService: Auth_Services) { }

  @Input() set appHasRole(roles: string[]){
    if(this.authService.IsAuthorize(roles)){
      this.viewContainer.createEmbeddedView(this.templateRef)
    }
    else
    {
      this.viewContainer.clear()
    }
  }
}
