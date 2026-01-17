import { customElement } from "lit/decorators.js";
import { PageNewPost } from "./page-new-post";

@customElement("page-edit-post")
export class PageEditPost extends PageNewPost {
  constructor() {
    super();
    this.isEdit = true;
  }
}
