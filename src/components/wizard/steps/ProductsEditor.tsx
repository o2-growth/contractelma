import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Product } from "../ContractWizard";
import { cn } from "@/lib/utils";

interface ProductsEditorProps {
  products: Product[];
  onChange: (products: Product[]) => void;
}

export function ProductsEditor({ products, onChange }: ProductsEditorProps) {
  const [editingCell, setEditingCell] = useState<string | null>(null);

  const addProduct = useCallback(() => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      total: 0,
    };
    onChange([...products, newProduct]);
    setEditingCell(`${newProduct.id}-name`);
  }, [products, onChange]);

  const removeProduct = useCallback((id: string) => {
    onChange(products.filter((p) => p.id !== id));
  }, [products, onChange]);

  const updateProduct = useCallback((id: string, field: keyof Product, value: string | number) => {
    onChange(
      products.map((p) => {
        if (p.id !== id) return p;
        
        const updated = { ...p, [field]: value };
        
        // Recalculate total
        const qty = field === "quantity" ? Number(value) : p.quantity;
        const price = field === "unitPrice" ? Number(value) : p.unitPrice;
        const discount = field === "discount" ? Number(value) : p.discount;
        
        updated.total = qty * price * (1 - discount / 100);
        
        return updated;
      })
    );
  }, [products, onChange]);

  const totalGeral = products.reduce((sum, p) => sum + p.total, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Produtos e Serviços
        </h2>
        <p className="mt-1 text-muted-foreground">
          Adicione os itens que farão parte do contrato
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card overflow-hidden"
      >
        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 border-b border-border bg-muted px-6 py-3 text-sm font-medium text-muted-foreground">
          <div className="col-span-4">Produto / Serviço</div>
          <div className="col-span-2 text-center">Qtd</div>
          <div className="col-span-2 text-right">Valor Unit.</div>
          <div className="col-span-1 text-center">Desc. %</div>
          <div className="col-span-2 text-right">Total</div>
          <div className="col-span-1"></div>
        </div>

        {/* Table body */}
        <div className="divide-y divide-border">
          <AnimatePresence>
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  "grid grid-cols-12 gap-4 px-6 py-4 items-center",
                  index % 2 === 1 && "bg-muted/30"
                )}
              >
                {/* Product name */}
                <div className="col-span-4">
                  <Input
                    value={product.name}
                    onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                    placeholder="Nome do produto"
                    className="border-transparent bg-transparent hover:border-border focus:border-primary"
                  />
                </div>

                {/* Quantity */}
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) => updateProduct(product.id, "quantity", parseInt(e.target.value) || 0)}
                    className="border-transparent bg-transparent text-center hover:border-border focus:border-primary"
                  />
                </div>

                {/* Unit price */}
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={product.unitPrice}
                    onChange={(e) => updateProduct(product.id, "unitPrice", parseFloat(e.target.value) || 0)}
                    className="border-transparent bg-transparent text-right font-mono hover:border-border focus:border-primary"
                  />
                </div>

                {/* Discount */}
                <div className="col-span-1">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={product.discount}
                    onChange={(e) => updateProduct(product.id, "discount", parseFloat(e.target.value) || 0)}
                    className="border-transparent bg-transparent text-center hover:border-border focus:border-primary"
                  />
                </div>

                {/* Total */}
                <div className="col-span-2 text-right font-mono font-semibold text-foreground">
                  {formatCurrency(product.total)}
                </div>

                {/* Delete */}
                <div className="col-span-1 flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProduct(product.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {products.length === 0 && (
            <div className="px-6 py-12 text-center text-muted-foreground">
              Nenhum produto adicionado. Clique no botão abaixo para começar.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-muted/50 px-6 py-4">
          <Button onClick={addProduct} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Produto
          </Button>

          <motion.div
            key={totalGeral}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            className="text-right"
          >
            <span className="text-sm text-muted-foreground">Total Geral:</span>
            <span className="ml-3 font-mono text-xl font-bold text-foreground">
              {formatCurrency(totalGeral)}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
