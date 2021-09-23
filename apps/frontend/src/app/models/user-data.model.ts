import { PaginationLinks } from '../pagination-links.model';
import { PaginationMeta } from '../pagination-meta.model';
import { User } from '../services/authentication-service/authentication.service';


export interface UserData {
  items: User[];
  meta: PaginationMeta;
  links: PaginationLinks;
}
