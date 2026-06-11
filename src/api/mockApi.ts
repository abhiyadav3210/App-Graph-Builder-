export interface AppItem {
  id: string;
  name: string;
  language: 'golang' | 'java' | 'python' | 'ruby' | 'go';
}

export type NodeStatus = 'healthy' | 'degraded' | 'down';
export type NodeMetricType = 'cpu' | 'memory' | 'disk' | 'region';

export interface GraphNodeData {
  label: string;
  type: 'service' | 'db' | 'cache';
  status: NodeStatus;
  cost: string;
  cpu: number;
  memory: number;
  disk: number;
  region: string;
  activeMetric: NodeMetricType;
  description: string;
  provider: 'aws' | 'gcp' | 'azure';
  [key: string]: unknown; // satisfy Record<string, unknown> in ReactFlow CustomNode
}

export interface GraphNode {
  id: string;
  type: 'customNode';
  position: { x: number; y: number };
  data: GraphNodeData;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export const MOCK_APPS: AppItem[] = [
  { id: 'supertokens-golang', name: 'supertokens-golang', language: 'golang' },
  { id: 'supertokens-java', name: 'supertokens-java', language: 'java' },
  { id: 'supertokens-python', name: 'supertokens-python', language: 'python' },
  { id: 'supertokens-ruby', name: 'supertokens-ruby', language: 'ruby' },
  { id: 'supertokens-go', name: 'supertokens-go', language: 'go' },
];

const MOCK_GRAPHS: Record<string, GraphData> = {
  'supertokens-golang': {
    nodes: [
      {
        id: 'node-auth',
        type: 'customNode',
        position: { x: 50, y: 150 },
        data: {
          label: 'Auth Service',
          type: 'service',
          status: 'degraded',
          cost: '$0.05/HR',
          cpu: 85,
          memory: 40,
          disk: 15,
          region: 'us-east-1',
          activeMetric: 'cpu',
          description: 'Go authentication and session verification microservice.',
          provider: 'aws',
        },
      },
      {
        id: 'node-postgres',
        type: 'customNode',
        position: { x: 450, y: 50 },
        data: {
          label: 'Postgres DB',
          type: 'db',
          status: 'healthy',
          cost: '$0.03/HR',
          cpu: 45,
          memory: 60,
          disk: 25,
          region: 'us-east-1',
          activeMetric: 'memory',
          description: 'Primary relational storage for auth sessions.',
          provider: 'aws',
        },
      },
      {
        id: 'node-redis',
        type: 'customNode',
        position: { x: 450, y: 280 },
        data: {
          label: 'Redis Cache',
          type: 'cache',
          status: 'healthy',
          cost: '$0.01/HR',
          cpu: 12,
          memory: 80,
          disk: 10,
          region: 'us-east-1',
          activeMetric: 'region',
          description: 'In-memory fast lookup cache for rate limits.',
          provider: 'aws',
        },
      },
    ],
    edges: [
      { id: 'e-auth-pg', source: 'node-auth', target: 'node-postgres', animated: true },
      { id: 'e-auth-redis', source: 'node-auth', target: 'node-redis', animated: false },
    ],
  },
  'supertokens-java': {
    nodes: [
      {
        id: 'node-java-web',
        type: 'customNode',
        position: { x: 50, y: 120 },
        data: {
          label: 'Java Spring Web',
          type: 'service',
          status: 'healthy',
          cost: '$0.08/HR',
          cpu: 50,
          memory: 75,
          disk: 30,
          region: 'eu-west-1',
          activeMetric: 'cpu',
          description: 'Spring Boot web MVC frontend backend API.',
          provider: 'gcp',
        },
      },
      {
        id: 'node-pg-java',
        type: 'customNode',
        position: { x: 400, y: 50 },
        data: {
          label: 'Postgres DB',
          type: 'db',
          status: 'healthy',
          cost: '$0.04/HR',
          cpu: 30,
          memory: 50,
          disk: 40,
          region: 'eu-west-1',
          activeMetric: 'memory',
          description: 'Spring JPA persistent relational storage.',
          provider: 'gcp',
        },
      },
      {
        id: 'node-search',
        type: 'customNode',
        position: { x: 400, y: 250 },
        data: {
          label: 'ElasticSearch',
          type: 'db',
          status: 'down',
          cost: '$0.12/HR',
          cpu: 0,
          memory: 0,
          disk: 92,
          region: 'eu-west-1',
          activeMetric: 'disk',
          description: 'Full-text search clustering and analytics service.',
          provider: 'gcp',
        },
      },
    ],
    edges: [
      { id: 'e-java-pg', source: 'node-java-web', target: 'node-pg-java', animated: true },
      { id: 'e-java-search', source: 'node-java-web', target: 'node-search', animated: false },
    ],
  },
  'supertokens-python': {
    nodes: [
      {
        id: 'node-django',
        type: 'customNode',
        position: { x: 60, y: 150 },
        data: {
          label: 'Django Backend',
          type: 'service',
          status: 'healthy',
          cost: '$0.06/HR',
          cpu: 22,
          memory: 35,
          disk: 12,
          region: 'us-west-2',
          activeMetric: 'cpu',
          description: 'Django REST framework JSON API microservice.',
          provider: 'azure',
        },
      },
      {
        id: 'node-mongo',
        type: 'customNode',
        position: { x: 420, y: 60 },
        data: {
          label: 'MongoDB Atlas',
          type: 'db',
          status: 'degraded',
          cost: '$0.07/HR',
          cpu: 70,
          memory: 85,
          disk: 65,
          region: 'us-west-2',
          activeMetric: 'memory',
          description: 'Document database for catalog data storage.',
          provider: 'azure',
        },
      },
      {
        id: 'node-celery',
        type: 'customNode',
        position: { x: 420, y: 260 },
        data: {
          label: 'Celery Broker',
          type: 'cache',
          status: 'healthy',
          cost: '$0.02/HR',
          cpu: 15,
          memory: 45,
          disk: 5,
          region: 'us-west-2',
          activeMetric: 'region',
          description: 'Celery redis-backed queue worker broker.',
          provider: 'azure',
        },
      },
    ],
    edges: [
      { id: 'e-py-mongo', source: 'node-django', target: 'node-mongo', animated: true },
      { id: 'e-py-celery', source: 'node-django', target: 'node-celery', animated: true },
    ],
  },
  'supertokens-ruby': {
    nodes: [
      {
        id: 'node-rails',
        type: 'customNode',
        position: { x: 80, y: 120 },
        data: {
          label: 'Rails API',
          type: 'service',
          status: 'healthy',
          cost: '$0.07/HR',
          cpu: 40,
          memory: 60,
          disk: 20,
          region: 'ap-south-1',
          activeMetric: 'cpu',
          description: 'Ruby on Rails JSON microservice.',
          provider: 'aws',
        },
      },
      {
        id: 'node-ruby-pg',
        type: 'customNode',
        position: { x: 400, y: 120 },
        data: {
          label: 'PostgreSQL Server',
          type: 'db',
          status: 'healthy',
          cost: '$0.05/HR',
          cpu: 25,
          memory: 30,
          disk: 50,
          region: 'ap-south-1',
          activeMetric: 'disk',
          description: 'ActiveRecord transactional server.',
          provider: 'aws',
        },
      },
    ],
    edges: [
      { id: 'e-rails-pg', source: 'node-rails', target: 'node-ruby-pg', animated: true },
    ],
  },
  'supertokens-go': {
    nodes: [
      {
        id: 'node-go-gateway',
        type: 'customNode',
        position: { x: 50, y: 150 },
        data: {
          label: 'Go Gateway',
          type: 'service',
          status: 'healthy',
          cost: '$0.04/HR',
          cpu: 10,
          memory: 20,
          disk: 5,
          region: 'us-east-1',
          activeMetric: 'cpu',
          description: 'API routing and client facing HTTP gateway.',
          provider: 'aws',
        },
      },
      {
        id: 'node-go-auth',
        type: 'customNode',
        position: { x: 320, y: 50 },
        data: {
          label: 'Auth microservice',
          type: 'service',
          status: 'healthy',
          cost: '$0.05/HR',
          cpu: 15,
          memory: 30,
          disk: 8,
          region: 'us-east-1',
          activeMetric: 'memory',
          description: 'JWT token signing and OAuth management.',
          provider: 'aws',
        },
      },
      {
        id: 'node-go-db',
        type: 'customNode',
        position: { x: 580, y: 150 },
        data: {
          label: 'MongoDB Store',
          type: 'db',
          status: 'healthy',
          cost: '$0.06/HR',
          cpu: 35,
          memory: 45,
          disk: 30,
          region: 'us-east-1',
          activeMetric: 'disk',
          description: 'NoSQL user details document database.',
          provider: 'aws',
        },
      },
    ],
    edges: [
      { id: 'e-gtw-auth', source: 'node-go-gateway', target: 'node-go-auth', animated: true },
      { id: 'e-auth-db', source: 'node-go-auth', target: 'node-go-db', animated: true },
    ],
  },
};

// Global in-memory data store for live modifications during runtime session
const liveGraphs: Record<string, GraphData> = JSON.parse(JSON.stringify(MOCK_GRAPHS));

// Simulation flags
let triggerErrorOnce = false;
export const setTriggerErrorOnce = (val: boolean) => {
  triggerErrorOnce = val;
};

export const fetchApps = async (): Promise<AppItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_APPS);
    }, 600);
  });
};

export const fetchAppGraph = async (appId: string): Promise<GraphData> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (triggerErrorOnce) {
        triggerErrorOnce = false; // reset
        reject(new Error('Simulated API query failure! Try again.'));
        return;
      }
      const graph = liveGraphs[appId] || { nodes: [], edges: [] };
      // Always return a deep clone to prevent mutations before cache updates
      resolve(JSON.parse(JSON.stringify(graph)));
    }, 800);
  });
};

export const updateLiveNode = (appId: string, nodeId: string, updatedData: Partial<GraphNodeData>) => {
  const graph = liveGraphs[appId];
  if (!graph) return;
  const node = graph.nodes.find((n) => n.id === nodeId);
  if (node) {
    node.data = { ...node.data, ...updatedData };
  }
};

export const updateLiveNodes = (appId: string, nodes: GraphNode[]) => {
  const graph = liveGraphs[appId];
  if (!graph) return;
  graph.nodes = JSON.parse(JSON.stringify(nodes));
};

export const updateLiveEdges = (appId: string, edges: GraphEdge[]) => {
  const graph = liveGraphs[appId];
  if (!graph) return;
  graph.edges = JSON.parse(JSON.stringify(edges));
};

export const addLiveNode = (appId: string, node: GraphNode) => {
  const graph = liveGraphs[appId];
  if (!graph) return;
  graph.nodes.push(node);
};
