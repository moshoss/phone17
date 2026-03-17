import { Table, useTable, type TableColumnDef, type TableRef } from '~/components/Table'

interface Product {
  name: string
  price: number
  stock: number
  category: string
  status: string
  sku: string
  supplier: string
  weight: string
  rating: number
}

const rawData: Product[] = [
  { name: 'MacBook Pro', price: 14999, stock: 23, category: '电脑', status: '在售', sku: 'MBP-2024-001', supplier: 'Apple Inc.', weight: '1.6kg', rating: 4.8 },
  { name: 'iPhone 16', price: 7999, stock: 156, category: '手机', status: '在售', sku: 'IPH-2024-016', supplier: 'Apple Inc.', weight: '0.17kg', rating: 4.6 },
  { name: 'AirPods Pro', price: 1899, stock: 320, category: '配件', status: '在售', sku: 'APP-2024-002', supplier: 'Apple Inc.', weight: '0.05kg', rating: 4.7 },
  { name: 'iPad Air', price: 4799, stock: 67, category: '平板', status: '预售', sku: 'IPA-2024-005', supplier: 'Apple Inc.', weight: '0.46kg', rating: 4.5 },
  { name: 'Apple Watch', price: 2999, stock: 89, category: '穿戴', status: '在售', sku: 'APW-2024-009', supplier: 'Apple Inc.', weight: '0.04kg', rating: 4.4 },
  { name: 'Mac Mini', price: 4499, stock: 45, category: '电脑', status: '缺货', sku: 'MMI-2024-003', supplier: 'Apple Inc.', weight: '0.68kg', rating: 4.3 },
  { name: 'HomePod', price: 2299, stock: 0, category: '配件', status: '缺货', sku: 'HPD-2024-001', supplier: 'Apple Inc.', weight: '2.3kg', rating: 4.1 },
  { name: 'Vision Pro', price: 29999, stock: 5, category: '穿戴', status: '预售', sku: 'AVP-2024-001', supplier: 'Apple Inc.', weight: '0.65kg', rating: 4.9 },
]

export default function FilterDemo() {
  let tableRef: TableRef
  const { indexColumn, sortable, filterable } = useTable<Product>({ data: () => rawData })

  const columns: TableColumnDef<Product>[] = [
    { ...indexColumn(), fixed: 'left' },
    sortable(filterable({ accessorKey: 'name', header: '名称', size: 180, fixed: 'left' })),
    filterable({ accessorKey: 'category', header: '分类', size: 100 }, { mode: 'select' }),
    filterable({ accessorKey: 'status', header: '状态', size: 100 }, { mode: 'select' }),
    sortable({ accessorKey: 'price', header: '价格', size: 120, cell: (info) => `¥${info.getValue<number>().toLocaleString()}` }),
    sortable({ accessorKey: 'stock', header: '库存', size: 100 }),
    { accessorKey: 'sku', header: 'SKU', size: 160 },
    { accessorKey: 'supplier', header: '供应商', size: 150 },
    { accessorKey: 'weight', header: '重量', size: 100 },
    sortable({ accessorKey: 'rating', header: '评分', size: 100, fixed: 'right', cell: (info) => `⭐ ${info.getValue<number>()}` }),
  ]

  return (
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold">Filter + Sort + Fixed Columns Demo</h1>
        <div class="flex gap-2">
          <button
            class="px-3 py-1.5 text-sm rounded-md bg-muted hover:bg-muted/80 transition-colors"
            onClick={() => tableRef.clearFilters()}
          >
            清除筛选
          </button>
          <button
            class="px-3 py-1.5 text-sm rounded-md bg-muted hover:bg-muted/80 transition-colors"
            onClick={() => tableRef.clearSort()}
          >
            清除排序
          </button>
          <button
            class="px-3 py-1.5 text-sm rounded-md bg-muted hover:bg-muted/80 transition-colors"
            onClick={() => tableRef.reset()}
          >
            重置全部
          </button>
        </div>
      </div>
      <p class="text-sm text-muted-foreground mb-4">
        序号+名称列固定在左侧 | 评分列固定在右侧 | 水平滚动查看效果
      </p>
      <div style={{ "max-width": "800px" }}>
        <Table data={rawData} columns={columns} ref={(api) => (tableRef = api)} />
      </div>
    </div>
  )
}
