import { prisma } from '@/lib/prisma'

import Pagination from '@/components/pagination'
import Products from '@/components/products'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PageProps {
  params: {
    page: string
  }
}

export default async function Page({ params }: PageProps) {
  const { page } = params

  const take = 2
  const skip = (Number(page) - 1) * take

  const query = await prisma.$transaction([
    prisma.product.count(),
    prisma.product.findMany({
      take,
      skip,
    }),
  ])
  const total = query[0]
  const products = query[1]

  return (
    <div className="w-5/6 mx-auto py-8">
      <div className="mt-8">
        {products && products.length > 0 ? (
          <Products products={products} />
        ) : (
          <Alert>
            <AlertDescription>
              There are no products in the database yet.
            </AlertDescription>
          </Alert>
        )}
      </div>
      <Pagination pages={Math.ceil(total / take)} activePage={parseInt(page)} />
    </div>
  )
}
