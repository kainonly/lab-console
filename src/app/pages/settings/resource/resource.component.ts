import { Component, OnInit } from '@angular/core';

import { NzFormatEmitEvent, NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { ResourceStruct } from 'ngx-bit/router';

import { ResourceService } from './resource.service';

@Component({
  selector: 'app-settings-resource',
  templateUrl: './resource.component.html'
})
export class ResourceComponent implements OnInit {
  name = '';
  nodes: NzTreeNodeOptions[] = [];
  schema: any[] = [{ type: 'string', field: 'name' }];
  data?: Record<string, any>;

  constructor(private resource: ResourceService) {}

  ngOnInit(): void {
    this.getData();
  }

  private getData(): void {
    this.resource.api.findMany().subscribe(data => {
      const nodes: NzTreeNodeOptions[] = [];
      const dict: Record<string, NzTreeNodeOptions> = {};
      for (const x of data as ResourceStruct[]) {
        dict[x.key] = {
          title: `${x.name}`,
          key: x.key,
          parent: x.parent,
          isLeaf: true,
          expanded: true,
          originData: x
        };
      }
      for (const x of data as ResourceStruct[]) {
        const options = dict[x.key];
        if (x.parent === 'root') {
          nodes.push(options);
        } else {
          if (dict.hasOwnProperty(x.parent)) {
            if (!dict[x.parent].hasOwnProperty('children')) {
              dict[x.parent].children = [];
            }
            dict[x.parent].children!.push(options);
            dict[x.parent].isLeaf = false;
          }
        }
      }
      this.nodes = [...nodes];
    });
  }

  fetch(e: NzFormatEmitEvent) {
    this.data = e.node?.origin.originData;
  }

  setExpanded(nodes: NzTreeNode[], value: boolean): void {
    for (const node of nodes) {
      node.isExpanded = value;
      if (node.children.length !== 0) {
        this.setExpanded(node.children, value);
      }
    }
  }
}
