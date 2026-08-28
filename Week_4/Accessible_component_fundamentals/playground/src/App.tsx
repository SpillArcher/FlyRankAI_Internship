import { Modal } from './playground/Modal'
import { Tabs } from './playground/Tabs'
import { Disclosure } from './playground/Disclosure'
import { Button } from './components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog'
import { Tabs as ShadcnTabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'

function App() {
  return (
    <main>
      <h1>Accessible components playground</h1>
      <p className="section-hint">
        Hand-built versions (against the ARIA APG patterns) next to shadcn/ui's versions of the
        same widgets, for comparison. Try each one keyboard-only: Tab, Shift+Tab, Escape, and
        arrow keys where the pattern calls for them.
      </p>

      <section className="section">
        <h2>Modal dialog</h2>
        <Modal
          triggerLabel="Open hand-built modal"
          title="Delete project?"
          description="This can't be undone. The project and its files will be permanently removed."
        >
          <p>Focus is trapped here. Try Tab, Shift+Tab, and Escape.</p>
          <input type="text" placeholder="A focusable field to tab through" />
        </Modal>
      </section>

      <section className="section">
        <h2>Modal dialog - shadcn/ui</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open shadcn modal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete project?</DialogTitle>
              <DialogDescription>
                This can't be undone. The project and its files will be permanently removed.
              </DialogDescription>
            </DialogHeader>
            <input type="text" placeholder="A focusable field to tab through" />
            <DialogFooter>
              <Button variant="destructive">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <section className="section">
        <h2>Tabs </h2>
        <Tabs
          label="Hand-built tabs example"
          items={[
            { id: 'profile', label: 'Profile', panel: <p>Profile panel content.</p> },
            { id: 'account', label: 'Account', panel: <p>Account panel content.</p> },
            { id: 'billing', label: 'Billing', panel: <p>Billing panel content.</p> },
          ]}
        />
      </section>

      <section className="section">
        <h2>Tabs - shadcn/ui</h2>
        <ShadcnTabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">Profile panel content.</TabsContent>
          <TabsContent value="account">Account panel content.</TabsContent>
          <TabsContent value="billing">Billing panel content.</TabsContent>
        </ShadcnTabs>
      </section>

      <section className="section">
        <h2>Disclosure </h2>
        <Disclosure summary="What's included in the free plan?">
          <p>Up to 3 projects, community support, and 1GB of storage.</p>
        </Disclosure>
        <Disclosure summary="Can I change plans later?">
          <p>Yes, upgrade or downgrade at any time from account settings.</p>
        </Disclosure>
      </section>
    </main>
  )
}

export default App
