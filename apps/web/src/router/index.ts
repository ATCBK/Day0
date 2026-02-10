import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/studio/workflow/demo"
    },
    {
      path: "/studio/agent/:agentId",
      component: () => import("@/pages/studio/agent/[agentId]/index.vue")
    },
    {
      path: "/studio/workflow/:workflowId",
      component: () => import("@/pages/studio/workflow/[workflowId]/index.vue")
    },
    {
      path: "/studio/knowledge",
      component: () => import("@/pages/studio/knowledge/index.vue")
    }
  ]
});

export default router;
