import { Table, useTable, type TableColumnDef, type TableRef } from '~/components/Table'

interface Product {
  name: string
  price: number
  stock: number
  category: string
}

const rawData: Product[] = [
  { name: 'MacBook Pro', price: 14999, stock: 23, category: '电脑' },
  { name: 'iPhone 16', price: 7999, stock: 156, category: '手机' },
  { name: 'AirPods Pro', price: 1899, stock: 320, category: '配件' },
  { name: 'iPad Air', price: 4799, stock: 67, category: '平板' },
  { name: 'Apple Watch', price: 2999, stock: 89, category: '穿戴' },
  { name: 'Mac Mini', price: 4499, stock: 45, category: '电脑' },
  { name: 'HomePod', price: 2299, stock: 12, category: '配件' },
]

export default function SortableDemo() {
  let tableRef: TableRef
  const { selectionColumn, indexColumn, sortable } = useTable<Product>({ data: () => rawData })

  const columns: TableColumnDef<Product>[] = [
    selectionColumn(),
    indexColumn(),
    sortable({ accessorKey: 'name', header: '名称', size: 200 }),
    sortable({ accessorKey: 'category', header: '分类', size: 100 }),
    sortable({ accessorKey: 'price', header: '价格', size: 120, cell: (info) => `¥${info.getValue<number>().toLocaleString()}` }),
    sortable({ accessorKey: 'stock', header: '库存', size: 100 }),
  ]

  return (
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold">Sort Demo</h1>
        <button
          class="px-3 py-1.5 text-sm rounded-md bg-muted hover:bg-muted/80 transition-colors"
          onClick={() => tableRef.clearSort()}
        >
          清除排序
        </button>
      </div>
      <p class="text-sm text-muted-foreground mb-4">
        点击表头切换排序：升序 → 降序 → 无排序
      </p>
      <Table data={rawData} columns={columns} ref={(api) => (tableRef = api)} />
    </div>
  )
}
